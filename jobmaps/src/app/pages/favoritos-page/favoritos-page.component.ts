// importacion de decoradores y modulos de angular
import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { NgIf, NgFor } from '@angular/common';
// importacion de servicios personalizados
import { JobService, Oferta, OfertaConId } from '../../services/job.service';
import { FavoritosService } from '../../services/favoritos.service';
import { UserService } from '../../services/user.service';
// importacion del servicio de rutas de angular
import { Router } from '@angular/router';
// importacion de modulo de iconos de angular material
import { MatIconModule } from '@angular/material/icon';
// importacion de componentes
import { OfertaDetalleComponent } from '../../components/oferta-detalle/oferta-detalle.component';
import { BottomNavComponent } from '../../components/bottom-nav/bottom-nav.component';
// importacion de formularios
import { FormsModule, NgModel } from '@angular/forms';

// decorador que define las propiedades del componente
@Component({
  selector: 'app-favoritos-page', // selector para usar el componente en html
  standalone: true, // componente independiente
  imports: [
    CommonModule,
    NgIf,
    NgFor,
    MatIconModule,
    OfertaDetalleComponent,
    BottomNavComponent,
    FormsModule
  ],
  templateUrl: './favoritos-page.component.html', // ruta del template html
  styleUrls: ['./favoritos-page.component.scss'], // ruta de los estilos
})
export class FavoritosPageComponent implements OnInit {
  // variables para gestionar las ofertas y el estado de la pagina
  ofertas: OfertaConId[] = [];
  activeTab = 'favourites';
  direccionTexto: string = '';
  direccionInvalida = false;
  selectedOferta: (Oferta & { id: string }) | null = null;
  edicionOferta: (Oferta & { id: string }) | null = null;
  titulo: string = '';
  descripcion: string = '';
  salario: number = 0;
  tipoContrato: string = '';
  inicio: string = '';
  logoUrl: string = '';
  mostrarPopupEdicion = false;
  mostrarPopup = false;

  // inyeccion de dependencias: servicios y router
  constructor(
    private jobService: JobService,
    private favoritosService: FavoritosService,
    private userService: UserService,
    private router: Router,
    private location: Location
  ) {}

  // metodo que se ejecuta al iniciar el componente
  async ngOnInit(): Promise<void> {
    await this.userService.usuarioCargado; // espera a que el usuario este cargado
    const todas = await this.jobService.getOfertas(); // obtiene todas las ofertas
    const idsFavoritos = await this.favoritosService.getFavoritosIds(); // obtiene los ids de favoritos
    this.ofertas = todas.filter((oferta) => idsFavoritos.includes(oferta.id)); // filtra las ofertas favoritas
  }

  // metodo para eliminar una oferta de la lista
  eliminarOfertaDeLista(id: string) {
    this.ofertas = this.ofertas.filter((oferta) => oferta.id !== id);
    this.selectedOferta = null; // cierra modal si estaba abierto
  }

  // metodo para guardar los cambios de una oferta editada
  async guardarCambios() {
    if (!this.edicionOferta) return;

    try {
      const datosActualizados: Partial<Oferta> = {
        titulo: this.titulo,
        descripcion: this.descripcion,
        salario: this.salario,
        tipoContrato: this.tipoContrato,
        inicio: this.inicio,
        logo: this.logoUrl,
      };

      await this.jobService.actualizarOferta(
        this.edicionOferta.id,
        datosActualizados
      );

      console.log('Offer updated successfully.');
      this.cerrarPopupEdicion(); // cierra el popup de edicion
      await this.recargarFavoritos(); // recarga las ofertas favoritas
    } catch (error) {
      console.error('Error updating the offer:', error);
    }
  }

  // metodo para recargar la lista de favoritos
  async recargarFavoritos() {
    const todas = await this.jobService.getOfertas();
    const idsFavoritos = await this.favoritosService.getFavoritosIds();
    this.ofertas = todas.filter((oferta) => idsFavoritos.includes(oferta.id));
  }

  // metodo para cerrar el modal de detalle de oferta
  cerrarModalOferta = () => {
    this.selectedOferta = null;
  };

  // metodo para volver a la pagina anterior
  goBack() {
    this.location.back();
  }

  // metodo para iniciar la edicion de una oferta
  editarOferta(oferta: Oferta & { id: string }) {
    this.edicionOferta = oferta;
    this.mostrarPopup = false;
    this.mostrarPopupEdicion = true;

    this.titulo = oferta.titulo;
    this.descripcion = oferta.descripcion;
    this.salario = oferta.salario;
    this.tipoContrato = oferta.tipoContrato;
    this.inicio = oferta.inicio;
    this.logoUrl = oferta.logo;
    this.direccionTexto = ''; // no se edita la ubicacion por ahora
  }

  // metodo para cerrar el popup de edicion
  cerrarPopupEdicion() {
    this.edicionOferta = null;
    this.mostrarPopupEdicion = false;
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
}
