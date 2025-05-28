import { Injectable } from '@angular/core';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
  collection,
} from 'firebase/firestore';
import { getAuth } from '@angular/fire/auth';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class AplicacionesService {
  private db = getFirestore();
  private auth = getAuth();

  constructor(private userService: UserService) {}

  private get uid(): string {
    const user = this.auth.currentUser;
    if (!user) throw new Error('Usuario no autenticado');
    return user.uid;
  }

  async aplicarAOferta(ofertaId: string, empresaId: string, titulo: string): Promise<void> {
    await this.userService.usuarioCargado;

    const ref = doc(this.db, `ofertas/${ofertaId}/aplicaciones/${this.uid}`);
    const yaExiste = await getDoc(ref);

    if (yaExiste.exists()) {
      throw new Error('Ya has aplicado a esta oferta.');
    }

    const nombre = this.userService.fullName;
    const email = this.userService.email;
    const cvUrl = this.userService.cvUrl;

    // Guardar aplicación
    await setDoc(ref, {
      nombre,
      email,
      fecha: serverTimestamp(),
    });

    // Crear notificación para la empresa incluyendo el enlace al CV
    await this.crearNotificacion(empresaId, ofertaId, nombre, email, titulo, cvUrl);
  }

  async crearNotificacion(
    empresaId: string,
    ofertaId: string,
    candidatoNombre: string,
    candidatoEmail: string,
    titulo: string,
    cvUrl: string
  ): Promise<void> {
    const notiRef = doc(collection(this.db, `users/${empresaId}/notificaciones`));

    await setDoc(notiRef, {
      candidatoNombre,
      candidatoEmail,
      ofertaId,
      titulo,
      cvUrl, // ✅ ahora sí lo guarda
      leido: false,
      timestamp: serverTimestamp(),
    });
  }

  async yaHaAplicado(ofertaId: string): Promise<boolean> {
    const ref = doc(this.db, `ofertas/${ofertaId}/aplicaciones/${this.uid}`);
    const snap = await getDoc(ref);
    return snap.exists();
  }
}
