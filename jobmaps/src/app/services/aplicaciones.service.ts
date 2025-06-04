// importacion de decoradores y funciones de firebase
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
// importacion del servicio de usuario
import { UserService } from './user.service';

// decorador que define el servicio como disponible en toda la aplicacion
@Injectable({
  providedIn: 'root',
})
export class AplicacionesService {
  // instancia de firestore y auth
  private db = getFirestore();
  private auth = getAuth();

  // inyeccion de dependencias: userService
  constructor(private userService: UserService) {}

  // getter para obtener el uid del usuario autenticado
  private get uid(): string {
    const user = this.auth.currentUser;
    if (!user) throw new Error('Usuario no autenticado');
    return user.uid;
  }

  // metodo para aplicar a una oferta
  async aplicarAOferta(ofertaId: string, empresaId: string, titulo: string): Promise<void> {
    await this.userService.usuarioCargado; // espera a que los datos del usuario esten cargados

    const ref = doc(this.db, `ofertas/${ofertaId}/aplicaciones/${this.uid}`);
    const yaExiste = await getDoc(ref);

    if (yaExiste.exists()) {
      throw new Error('Ya has aplicado a esta oferta.');
    }

    const nombre = this.userService.fullName;
    const email = this.userService.email;
    const cvUrl = this.userService.cvUrl;

    // guarda la aplicacion en firestore
    await setDoc(ref, {
      nombre,
      email,
      fecha: serverTimestamp(),
    });

    // crea una notificacion para la empresa
    await this.crearNotificacion(empresaId, ofertaId, nombre, email, titulo, cvUrl);
  }

  // metodo para crear una notificacion en firestore
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
      cvUrl,
      leido: false,
      timestamp: serverTimestamp(),
    });
  }

  // metodo para verificar si el usuario ya ha aplicado a una oferta
  async yaHaAplicado(ofertaId: string): Promise<boolean> {
    const ref = doc(this.db, `ofertas/${ofertaId}/aplicaciones/${this.uid}`);
    const snap = await getDoc(ref);
    return snap.exists();
  }
}
