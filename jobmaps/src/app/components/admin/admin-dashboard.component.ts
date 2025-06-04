import { getApps, initializeApp } from 'firebase/app';
// importacion de decorador para definir el componente
import { Component } from '@angular/core';
// importacion de modulo comun de angular
import { CommonModule } from '@angular/common';
// importacion de modulo de iconos de angular material
import { MatIconModule } from '@angular/material/icon';
// importacion del servicio de rutas de angular
import { Router } from '@angular/router';
// importaciones de funciones de firestore
import {
  getFirestore,
  collection,
  getDocs,
  deleteDoc,
  doc,
} from 'firebase/firestore';
import { env } from 'process';
import { environment } from '../../../environments/environment';

// decorador que define las propiedades del componente
@Component({
  selector: 'app-admin-dashboard', // selector para usar el componente en html
  standalone: true, // componente independiente
  templateUrl: './admin-dashboard.component.html', // ruta del template html
  styleUrls: ['./admin-dashboard.component.scss'], // ruta de los estilos
  imports: [CommonModule, MatIconModule], // modulos importados para el template
})
export class AdminDashboardComponent {
  // variable para controlar la vista activa, usuarios o ofertas
  view: 'usuarios' | 'ofertas' = 'usuarios';
  // array para almacenar usuarios
  usuarios: any[] = [];
  // array para almacenar ofertas
  ofertas: any[] = [];
  // variable para la pestaña activa, actualmente no utilizada
  activeTab: string = 'profile';

  // inyeccion de dependencias, router para navegar entre rutas
  constructor(private router: Router) {
    if (!getApps().length) {
      initializeApp(environment.firebase);
    }
  }

  // metodo que se ejecuta al iniciar el componente
  async ngOnInit() {
    await this.loadUsuarios(); // carga los usuarios
    await this.loadOfertas(); // carga las ofertas
  }

  // metodo para cargar usuarios desde firestore
  async loadUsuarios() {
    const db = getFirestore(); // obtiene la instancia de firestore
    const usersSnapshot = await getDocs(collection(db, 'users')); // obtiene documentos de la coleccion 'users'
    this.usuarios = usersSnapshot.docs.map((doc) => ({
      id: doc.id, // id del documento
      ...doc.data(), // datos del documento
    }));
  }

  // metodo para cargar ofertas desde firestore
  async loadOfertas() {
    const db = getFirestore(); // obtiene la instancia de firestore
    const ofertasSnapshot = await getDocs(collection(db, 'ofertas')); // obtiene documentos de la coleccion 'ofertas'
    this.ofertas = ofertasSnapshot.docs.map((doc) => ({
      id: doc.id, // id del documento
      ...doc.data(), // datos del documento
    }));
  }

  // metodo para eliminar un usuario
  async eliminarUsuario(user: any) {
    // confirmacion antes de eliminar
    if (confirm(`Are you sure you want to delete ${user.fullName}?`)) {
      const db = getFirestore(); // obtiene la instancia de firestore
      await deleteDoc(doc(db, 'users', user.id)); // elimina el documento por id
      // actualiza el array de usuarios eliminando el usuario eliminado
      this.usuarios = this.usuarios.filter((u) => u.id !== user.id);
    }
  }

  // metodo para eliminar una oferta
  async eliminarOferta(oferta: any) {
    // confirmacion antes de eliminar
    if (
      confirm(`Are you sure you want to delete the offer "${oferta.titulo}"?`)
    ) {
      const db = getFirestore(); // obtiene la instancia de firestore
      await deleteDoc(doc(db, 'ofertas', oferta.id)); // elimina el documento por id
      // actualiza el array de ofertas eliminando la oferta eliminada
      this.ofertas = this.ofertas.filter((o) => o.id !== oferta.id);
    }
  }

  // metodo para cambiar la vista activa
  setView(newView: 'usuarios' | 'ofertas') {
    this.view = newView;
  }

  // metodo para navegar a la pagina de inicio
  goBack() {
    this.router.navigate(['/home']);
  }
}
