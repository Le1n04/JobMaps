import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { NgIf, NgFor } from '@angular/common';
import { JobService, Oferta, OfertaConId } from '../../services/job.service';
import { FavoritosService } from '../../services/favoritos.service';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { OfertaDetalleComponent } from '../../components/oferta-detalle/oferta-detalle.component';
import { BottomNavComponent } from '../../components/bottom-nav/bottom-nav.component';
import { FormsModule, NgModel } from '@angular/forms';

@Component({
  selector: 'app-favoritos-page',
  standalone: true,
  imports: [
    CommonModule,
    NgIf,
    NgFor,
    MatIconModule,
    OfertaDetalleComponent,
    BottomNavComponent,
    FormsModule
  ],
  templateUrl: './favoritos-page.component.html',
  styleUrls: ['./favoritos-page.component.scss'],
})
export class FavoritosPageComponent implements OnInit {
  ofertas: OfertaConId[] = [];
  activeTab = 'favourites';
  direccionTexto: string = '';
  direccionInvalida = false;
  selectedOferta: (Oferta & { id: string }) | null = null;
  edicionOferta: (Oferta & { id: string }) | null = null; // Editar
  titulo: string = '';
  descripcion: string = '';
  salario: number = 0;
  tipoContrato: string = '';
  inicio: string = '';
  logoUrl: string = '';
  mostrarPopupEdicion = false; // Popup para EDITAR oferta
  mostrarPopup = false;

  constructor(
    private jobService: JobService,
    private favoritosService: FavoritosService,
    private userService: UserService,
    private router: Router,
    private location: Location
  ) {}

  async ngOnInit(): Promise<void> {
    await this.userService.usuarioCargado;
    const todas = await this.jobService.getOfertas();
    const idsFavoritos = await this.favoritosService.getFavoritosIds();
    this.ofertas = todas.filter((oferta) => idsFavoritos.includes(oferta.id));
  }

  eliminarOfertaDeLista(id: string) {
    this.ofertas = this.ofertas.filter((oferta) => oferta.id !== id);
    this.selectedOferta = null; // cierra modal si no se hizo aún
  }

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

      // 🔥 Aquí podrías mostrar un Snackbar o Toast si tienes
      console.log('Offer updated successfully.');

      this.cerrarPopupEdicion();
      await this.recargarFavoritos();
    } catch (error) {
      console.error('Error updating the offer:', error);
      // Puedes mostrar Snackbar de error si quieres
    }
  }

  async recargarFavoritos() {
    const todas = await this.jobService.getOfertas();
    const idsFavoritos = await this.favoritosService.getFavoritosIds();
    this.ofertas = todas.filter((oferta) => idsFavoritos.includes(oferta.id));
  }

  cerrarModalOferta = () => {
    this.selectedOferta = null;
  };

  goBack() {
    this.location.back();
  }

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
    this.direccionTexto = ''; // por ahora no editamos ubicación
  }

  cerrarPopupEdicion() {
    this.edicionOferta = null;
    this.mostrarPopupEdicion = false;
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
}
