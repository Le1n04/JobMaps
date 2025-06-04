// importacion de decoradores y modulos de angular
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
// importacion del servicio de rutas de angular
import { Router } from '@angular/router';
// importacion de funciones de firestore
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
// importacion de servicios personalizados
import { UserService } from '../../services/user.service';
import { SnackbarService } from '../../services/snackbar.service';

// decorador que define las propiedades del componente
@Component({
  selector: 'app-crear-oferta', // selector para usar el componente en html
  standalone: true, // componente independiente
  imports: [CommonModule, FormsModule], // modulos importados
  templateUrl: './crear-oferta.component.html', // ruta del template html
  styleUrls: ['./crear-oferta.component.scss'], // ruta de los estilos
})
export class CrearOfertaComponent {
  // variables para almacenar el titulo y la descripcion de la oferta
  titulo: string = '';
  descripcion: string = '';

  // inyeccion de dependencias: servicio de usuario, router y snackbar
  constructor(
    private userService: UserService,
    private router: Router,
    private snackbar: SnackbarService
  ) {}

  // metodo para publicar una nueva oferta
  async publicarOferta() {
    const db = getFirestore(); // obtiene la instancia de firestore
    const ofertasRef = collection(db, 'ofertas'); // referencia a la coleccion 'ofertas'

    // objeto que representa la nueva oferta
    const nuevaOferta = {
      titulo: this.titulo,
      descripcion: this.descripcion,
      empresaId: this.userService.uid,
      ubicacion: this.userService.location,
      creadaEn: serverTimestamp(), // marca de tiempo del servidor
    };

    try {
      // guarda la nueva oferta en la base de datos
      await addDoc(ofertasRef, nuevaOferta);
      this.snackbar.mostrar('Oferta publicada correctamente.', 'ok'); // muestra mensaje de exito
      this.router.navigate(['/home']); // redirige al home
    } catch (error) {
      console.error('Error al publicar oferta:', error); // log de error
      this.snackbar.mostrar('Ocurrió un error al guardar la oferta.', 'error'); // muestra mensaje de error
    }
  }
}
