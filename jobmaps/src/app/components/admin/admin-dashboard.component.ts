import { getApps, initializeApp } from 'firebase/app';
import { Component, Inject, PLATFORM_ID } from '@angular/core'; // <-- AÑADIDO
import { isPlatformBrowser } from '@angular/common'; // <-- AÑADIDO
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import {
  getFirestore,
  collection,
  getDocs,
  deleteDoc,
  doc,
} from 'firebase/firestore';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss'],
  imports: [CommonModule, MatIconModule],
})
export class AdminDashboardComponent {
  view: 'usuarios' | 'ofertas' = 'usuarios';
  usuarios: any[] = [];
  ofertas: any[] = [];
  activeTab: string = 'profile';

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: any
  ) {
    if (!getApps().length) {
      initializeApp(environment.firebase);
    }
  }

  async ngOnInit() {
    // Solo ejecuta si estamos en navegador, no en prerender
    if (isPlatformBrowser(this.platformId)) {
      await this.loadUsuarios();
      await this.loadOfertas();
    }
  }

  async loadUsuarios() {
    const db = getFirestore();
    const usersSnapshot = await getDocs(collection(db, 'users'));
    this.usuarios = usersSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  }

  async loadOfertas() {
    const db = getFirestore();
    const ofertasSnapshot = await getDocs(collection(db, 'ofertas'));
    this.ofertas = ofertasSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  }

  async eliminarUsuario(user: any) {
    if (confirm(`Are you sure you want to delete ${user.fullName}?`)) {
      const db = getFirestore();
      await deleteDoc(doc(db, 'users', user.id));
      this.usuarios = this.usuarios.filter((u) => u.id !== user.id);
    }
  }

  async eliminarOferta(oferta: any) {
    if (
      confirm(`Are you sure you want to delete the offer "${oferta.titulo}"?`)
    ) {
      const db = getFirestore();
      await deleteDoc(doc(db, 'ofertas', oferta.id));
      this.ofertas = this.ofertas.filter((o) => o.id !== oferta.id);
    }
  }

  setView(newView: 'usuarios' | 'ofertas') {
    this.view = newView;
  }

  goBack() {
    this.router.navigate(['/home']);
  }
}
