// importacion de decoradores y modulos de angular
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
// importacion de autenticacion y firestore de firebase
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
// importacion del servicio de rutas de angular
import { Router } from '@angular/router';
// importacion de modulo de iconos de angular material
import { MatIconModule } from '@angular/material/icon';
// importacion de componentes personalizados
import { BottomNavComponent } from '../../components/bottom-nav/bottom-nav.component';
// importacion del servicio de notificaciones
import { NotificacionesService } from '../../services/notificaciones.service';

// definicion de la interfaz notificacion
interface Notificacion {
  id: string;
  titulo: string;
  candidatoNombre: string;
  candidatoEmail: string;
  leido: boolean;
  timestamp?: any;
  cvUrl?: string;
}

// decorador que define las propiedades del componente
@Component({
  selector: 'app-notificaciones-empresa', // selector para usar el componente en html
  standalone: true, // componente independiente
  imports: [CommonModule, MatIconModule, BottomNavComponent], // modulos importados
  templateUrl: './notificaciones-empresa.component.html', // ruta del template html
  styleUrls: ['./notificaciones-empresa.component.scss'], // ruta del archivo de estilos
})
export class NotificacionesEmpresaComponent implements OnInit {
  // array para almacenar notificaciones
  notificaciones: Notificacion[] = [];
  // instancia de firestore
  db = getFirestore();
  // variable para la pestaña activa
  activeTab: string = 'notifications';

  // inyeccion de dependencias: router y servicio de notificaciones
  constructor(
    private router: Router,
    private notificacionesService: NotificacionesService
  ) {}

  // metodo que se ejecuta al iniciar el componente
  async ngOnInit() {
    const user = getAuth().currentUser;
    if (!user) return;

    // referencia a la coleccion de notificaciones del usuario
    const notiRef = collection(this.db, `users/${user.uid}/notificaciones`);
    const q = query(notiRef, orderBy('timestamp', 'desc'));
    const snapshot = await getDocs(q);

    // mapeo de las notificaciones obtenidas
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

    // marca todas las notificaciones como leidas
    await this.notificacionesService.marcarTodasComoLeidas(user.uid);
  }

  // metodo para marcar una notificacion como leida
  async marcarComoLeido(noti: any) {
    const user = getAuth().currentUser;
    if (!user) return;

    const db = getFirestore();
    const notiRef = doc(db, `users/${user.uid}/notificaciones/${noti.id}`);
    await updateDoc(notiRef, { leido: true });
    noti.leido = true;

    // consulta si quedan notificaciones sin leer
    const q = query(
      collection(db, `users/${user.uid}/notificaciones`),
      where('leido', '==', false)
    );
    const snapshot = await getDocs(q);
    this.notificacionesService.actualizarEstado(snapshot.size > 0);
  }

  // metodo para cambiar la pestaña activa y navegar a la ruta correspondiente
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

  // metodo para volver a la pagina de inicio
  goBack() {
    this.router.navigate(['/home']);
  }
}
