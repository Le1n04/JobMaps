import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgFor, NgIf } from '@angular/common';
import { UserService } from '../../services/user.service'; // Ajusta el path si es diferente
import { JobService, Oferta, OfertaConId } from '../../services/job.service';
import { MatIconModule } from '@angular/material/icon'; // Opcional si quieres iconos
import { MatButtonModule } from '@angular/material/button'; // Para botones más bonitos
import { MatTableModule } from '@angular/material/table'; // Para tabla Angular Material (opcional, si no quieres tablas HTML normales)

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    NgFor,
    NgIf,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss'],
})
export class AdminDashboardComponent implements OnInit {
  usuarios: any[] = []; // Todos los usuarios aquí
  ofertas: OfertaConId[] = []; // Todas las ofertas aquí

  view: 'usuarios' | 'ofertas' = 'usuarios'; // Para cambiar entre pestañas

  constructor(
    private userService: UserService,
    private jobService: JobService
  ) {}

  async ngOnInit(): Promise<void> {
    await this.loadUsuarios();
    await this.loadOfertas();
  }

  async loadOfertas() {
    const snapshot = await this.jobService.getOfertas();
    this.ofertas = snapshot;
  }

  async loadUsuarios() {
    try {
      const { getFirestore, collection, getDocs } = await import(
        'firebase/firestore'
      );
      const db = getFirestore();
      const usuariosRef = collection(db, 'users'); // 👈 tu colección es 'users'
      const querySnapshot = await getDocs(usuariosRef);

      this.usuarios = querySnapshot.docs.map((doc) => {
        return {
          id: doc.id,
          ...(doc.data() as any),
        };
      });
    } catch (error) {
      console.error('Error cargando usuarios:', error);
    }
  }

  async eliminarUsuario(user: any) {
    const confirmacion = confirm(
      `¿Estás seguro de eliminar a ${user.fullName}?`
    );

    if (!confirmacion) {
      return;
    }

    try {
      const { getFirestore, doc, deleteDoc } = await import(
        'firebase/firestore'
      );
      const db = getFirestore();
      const userRef = doc(db, 'users', user.id); // 'users' es tu colección
      await deleteDoc(userRef);

      console.log('Usuario eliminado correctamente.');

      // 🔥 Recargar usuarios después de eliminar
      await this.loadUsuarios();
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
    }
  }

  async bloquearUsuario(user: any) {
    const confirmacion = confirm(`¿Quieres bloquear a ${user.fullName}?`);

    if (!confirmacion) {
      return;
    }

    try {
      const { getFirestore, doc, updateDoc } = await import(
        'firebase/firestore'
      );
      const db = getFirestore();
      const userRef = doc(db, 'users', user.id);

      await updateDoc(userRef, {
        role: 'bloqueado',
      });

      console.log('Usuario bloqueado correctamente.');

      // 🔥 Recargar usuarios
      await this.loadUsuarios();
    } catch (error) {
      console.error('Error al bloquear usuario:', error);
    }
  }

  async eliminarOferta(oferta: any) {
    const confirmacion = confirm(
      `¿Estás seguro de eliminar la oferta "${oferta.titulo}"?`
    );

    if (!confirmacion) {
      return;
    }

    try {
      const { getFirestore, doc, deleteDoc } = await import(
        'firebase/firestore'
      );
      const db = getFirestore();
      const ofertaRef = doc(db, 'ofertas', oferta.id); // 'ofertas' es tu colección
      await deleteDoc(ofertaRef);

      console.log('Oferta eliminada correctamente.');

      // 🔥 Recargar ofertas después de eliminar
      await this.loadOfertas();
    } catch (error) {
      console.error('Error al eliminar oferta:', error);
    }
  }

  setView(v: 'usuarios' | 'ofertas') {
    this.view = v;
  }
}
