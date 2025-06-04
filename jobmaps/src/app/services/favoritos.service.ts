// importacion de decoradores y funciones de firebase
import { Injectable } from '@angular/core';
import {
  getFirestore,
  doc,
  setDoc,
  deleteDoc,
  getDoc,
  collection,
  getDocs
} from 'firebase/firestore';
import { getAuth } from '@angular/fire/auth';

// decorador que define el servicio como disponible en toda la aplicacion
@Injectable({
  providedIn: 'root',
})
export class FavoritosService {
  // instancia de firestore y auth
  private db = getFirestore();
  private auth = getAuth();

  // getter para obtener el uid del usuario autenticado
  private get uid(): string {
    const user = this.auth.currentUser;
    if (!user) throw new Error('Usuario no autenticado');
    return user.uid;
  }

  // metodo para agregar una oferta a favoritos
  async addFavorito(ofertaId: string): Promise<void> {
    const ref = doc(this.db, `users/${this.uid}/favoritos/${ofertaId}`);
    await setDoc(ref, { favorito: true });
  }

  // metodo para eliminar una oferta de favoritos
  async removeFavorito(ofertaId: string): Promise<void> {
    const ref = doc(this.db, `users/${this.uid}/favoritos/${ofertaId}`);
    await deleteDoc(ref);
  }

  // metodo para obtener todos los ids de las ofertas favoritas
  async getFavoritosIds(): Promise<string[]> {
    const ref = collection(this.db, `users/${this.uid}/favoritos`);
    const snap = await getDocs(ref);
    return snap.docs.map((doc) => doc.id);
  }

  // metodo para verificar si una oferta esta en favoritos
  async isFavorito(ofertaId: string): Promise<boolean> {
    const ref = doc(this.db, `users/${this.uid}/favoritos/${ofertaId}`);
    const snap = await getDoc(ref);
    return snap.exists();
  }
}
