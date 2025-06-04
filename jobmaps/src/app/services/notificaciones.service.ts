// importacion de decoradores y funciones de firebase
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

// decorador que define el servicio como disponible en toda la aplicacion
@Injectable({
  providedIn: 'root',
})
export class NotificacionesService {
  // instancia de firestore y auth
  private db = getFirestore();
  private auth = getAuth();

  // subject para notificar cambios en el estado de notificaciones
  private notificacionesPendientes$ = new BehaviorSubject<boolean>(false);
  private _tieneNotificacionesSinLeer: any;

  // constructor que suscribe al estado de autenticacion
  constructor() {
    onAuthStateChanged(this.auth, (user: User | null) => {
      if (user) {
        const notiRef = collection(this.db, `users/${user.uid}/notificaciones`);
        const q = query(notiRef, where('leido', '==', false));

        // escucha en tiempo real si hay notificaciones no leidas
        onSnapshot(q, (snapshot) => {
          this.notificacionesPendientes$.next(!snapshot.empty);
        });
      } else {
        this.notificacionesPendientes$.next(false);
      }
    });
  }

  // getter para obtener un observable de las notificaciones no leidas
  get notificacionesNoLeidas$() {
    return this.notificacionesPendientes$.asObservable();
  }

  // metodo para actualizar el estado de notificaciones manualmente
  actualizarEstado(leido: boolean) {
    this.notificacionesPendientes$.next(!leido);
  }

  // metodo para marcar todas las notificaciones como leidas
  async marcarTodasComoLeidas(uid: string): Promise<void> {
    const notiRef = collection(this.db, `users/${uid}/notificaciones`);
    const q = query(notiRef, where('leido', '==', false));
    const snapshot = await getDocs(q);

    // actualiza cada documento marcandolo como leido
    const updates = snapshot.docs.map((docSnap) =>
      updateDoc(doc(this.db, `users/${uid}/notificaciones/${docSnap.id}`), {
        leido: true,
      })
    );

    await Promise.all(updates);
  }
}
