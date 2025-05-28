import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { getAuth, onAuthStateChanged, User } from '@angular/fire/auth';
import {
  getFirestore,
  collection,
  onSnapshot,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
} from 'firebase/firestore';

@Injectable({
  providedIn: 'root',
})
export class NotificacionesService {
  private db = getFirestore();
  private auth = getAuth();

  private notificacionesPendientes$ = new BehaviorSubject<boolean>(false);
  private _tieneNotificacionesSinLeer: any;

  constructor() {
    onAuthStateChanged(this.auth, (user: User | null) => {
      if (user) {
        const notiRef = collection(this.db, `users/${user.uid}/notificaciones`);
        const q = query(notiRef, where('leido', '==', false));

        onSnapshot(q, (snapshot) => {
          this.notificacionesPendientes$.next(!snapshot.empty);
        });
      } else {
        this.notificacionesPendientes$.next(false);
      }
    });
  }

  get notificacionesNoLeidas$() {
    return this.notificacionesPendientes$.asObservable();
  }

  actualizarEstado(leido: boolean) {
    this.notificacionesPendientes$.next(!leido);
  }

  async marcarTodasComoLeidas(uid: string): Promise<void> {
    const notiRef = collection(this.db, `users/${uid}/notificaciones`);
    const q = query(notiRef, where('leido', '==', false));
    const snapshot = await getDocs(q);

    const updates = snapshot.docs.map((docSnap) =>
      updateDoc(doc(this.db, `users/${uid}/notificaciones/${docSnap.id}`), {
        leido: true,
      })
    );

    await Promise.all(updates);
  }
}
