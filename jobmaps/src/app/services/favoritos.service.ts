import { Injectable } from '@angular/core';
import { getFirestore, doc, setDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { getAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class FavoritosService {
  private db = getFirestore();
  private auth = getAuth();

  private get uid(): string {
    const user = this.auth.currentUser;
    if (!user) throw new Error('Usuario no autenticado');
    return user.uid;
  }

  async addFavorito(ofertaId: string): Promise<void> {
    const ref = doc(this.db, `users/${this.uid}/favoritos/${ofertaId}`);
    await setDoc(ref, { favorito: true });
  }

  async removeFavorito(ofertaId: string): Promise<void> {
    const ref = doc(this.db, `users/${this.uid}/favoritos/${ofertaId}`);
    await deleteDoc(ref);
  }

  async isFavorito(ofertaId: string): Promise<boolean> {
    const ref = doc(this.db, `users/${this.uid}/favoritos/${ofertaId}`);
    const snap = await getDoc(ref);
    return snap.exists();
  }
}
