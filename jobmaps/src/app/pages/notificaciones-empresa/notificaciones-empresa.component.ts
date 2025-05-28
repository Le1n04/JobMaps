import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { getAuth } from '@angular/fire/auth';
import {
  collection,
  getDocs,
  getFirestore,
  orderBy,
  query,
  doc,
  updateDoc,
  where,
} from 'firebase/firestore';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { BottomNavComponent } from '../../components/bottom-nav/bottom-nav.component';
import { NotificacionesService } from '../../services/notificaciones.service';

interface Notificacion {
  id: string;
  titulo: string;
  candidatoNombre: string;
  candidatoEmail: string;
  leido: boolean;
  timestamp?: any;
  cvUrl?: string;
}

@Component({
  selector: 'app-notificaciones-empresa',
  standalone: true,
  imports: [CommonModule, MatIconModule, BottomNavComponent],
  templateUrl: './notificaciones-empresa.component.html',
  styleUrls: ['./notificaciones-empresa.component.scss'],
})
export class NotificacionesEmpresaComponent implements OnInit {
  notificaciones: Notificacion[] = [];
  db = getFirestore();
  activeTab: string = 'notifications';

  constructor(
    private router: Router,
    private notificacionesService: NotificacionesService
  ) {}

  async ngOnInit() {
    const user = getAuth().currentUser;
    if (!user) return;

    const notiRef = collection(this.db, `users/${user.uid}/notificaciones`);
    const q = query(notiRef, orderBy('timestamp', 'desc'));
    const snapshot = await getDocs(q);

    this.notificaciones = snapshot.docs.map((doc) => {
      const data = doc.data() as Omit<Notificacion, 'id'>;
      return {
        id: doc.id,
        titulo: data.titulo,
        candidatoNombre: data.candidatoNombre,
        candidatoEmail: data.candidatoEmail,
        leido: data.leido,
        timestamp: data.timestamp,
        cvUrl: data.cvUrl,
      };
    });

    await this.notificacionesService.marcarTodasComoLeidas(user.uid);
  }

  async marcarComoLeido(noti: any) {
    const user = getAuth().currentUser;
    if (!user) return;

    const db = getFirestore();
    const notiRef = doc(db, `users/${user.uid}/notificaciones/${noti.id}`);
    await updateDoc(notiRef, { leido: true });
    noti.leido = true;

    // Ver si aún hay notificaciones sin leer
    const q = query(
      collection(db, `users/${user.uid}/notificaciones`),
      where('leido', '==', false)
    );
    const snapshot = await getDocs(q);
    this.notificacionesService.actualizarEstado(snapshot.size > 0);
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;

    if (tab === 'browse') {
      this.router.navigate(['/home']);
    } else if (tab === 'favourites') {
      this.router.navigate(['/favoritos']);
    } else if (tab === 'notifications') {
      this.router.navigate(['/notifications']);
    } else if (tab === 'profile') {
      this.router.navigate(['/profile-settings']);
    }
  }

  goBack() {
    this.router.navigate(['/home']);
  }
}
