import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { getAuth } from '@angular/fire/auth';
import {
  collection,
  getDocs,
  getFirestore,
  orderBy,
  query,
} from 'firebase/firestore';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { BottomNavComponent } from "../../components/bottom-nav/bottom-nav.component";

@Component({
  selector: 'app-notificaciones-empresa',
  standalone: true,
  imports: [CommonModule, MatIconModule, BottomNavComponent],
  templateUrl: './notificaciones-empresa.component.html',
  styleUrls: ['./notificaciones-empresa.component.scss'],
})
export class NotificacionesEmpresaComponent implements OnInit {
  notificaciones: any[] = [];
  db = getFirestore();
  constructor(private router: Router) {}

  async ngOnInit() {
    const user = getAuth().currentUser;
    if (!user) return;

    const notiRef = collection(this.db, `users/${user.uid}/notificaciones`);
    const q = query(notiRef, orderBy('timestamp', 'desc'));
    const snapshot = await getDocs(q);

    this.notificaciones = snapshot.docs.map((doc) => doc.data());
  }

  activeTab: string = 'notifications';

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
    this.router.navigate(['/home']); // o cambia el tab en HomeComponent si estás usando una sola vista
  }
}
