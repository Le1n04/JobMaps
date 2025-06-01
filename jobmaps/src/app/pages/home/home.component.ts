import { Component, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { JobService, Oferta } from '../../services/job.service';
import { SnackbarService } from '../../services/snackbar.service';

import { OfertaDetalleComponent } from '../../components/oferta-detalle/oferta-detalle.component';
import { NotificacionesEmpresaComponent } from '../notificaciones-empresa/notificaciones-empresa.component';
import { BottomNavComponent } from '../../components/bottom-nav/bottom-nav.component';

import * as L from 'leaflet';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    OfertaDetalleComponent,
    NotificacionesEmpresaComponent,
    BottomNavComponent,
  ],
})
export class HomeComponent implements AfterViewInit {
  view: 'map' | 'list' = 'map';
  activeTab: string = 'browse';
  isBrowser: boolean;
  mostrarPopup = false;
  modoEdicion = false;              // 🔥 modo crear/editar
  map!: L.Map;
  marcadores: L.Marker[] = [];
  direccionTexto: string = '';
  direccionInvalida = false;
  selectedOferta: (Oferta & { id: string }) | null = null;

  // Campos del formulario
  titulo: string = '';
  descripcion: string = '';
  salario: number = 0;
  tipoContrato: string = '';
  inicio: string = '';
  logoUrl: string = '';

  jobs: (Oferta & { id: string })[] = [];

  constructor(
    @Inject(PLATFORM_ID) platformId: Object,
    private jobService: JobService,
    private authService: AuthService,
    private snackbar: SnackbarService,
    private userService: UserService,
    private router: Router
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  async convertirDireccionACoordenadas(direccion: string): Promise<{ lat: number; lng: number } | null> {
    const query = encodeURIComponent(direccion);
    const url = `https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.length > 0) {
        return {
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon),
        };
      }

      return null;
    } catch (error) {
      console.error('Error geocodificando dirección:', error);
      return null;
    }
  }

  async crearOferta() {
    this.direccionInvalida = false;

    const coords = await this.convertirDireccionACoordenadas(this.direccionTexto);

    if (!coords) {
      this.direccionInvalida = true;
      return;
    }

    const oferta: Oferta = {
      titulo: this.titulo,
      descripcion: this.descripcion,
      empresaId: this.userService.uid,
      inicio: this.inicio,
      salario: this.salario,
      tipoContrato: this.tipoContrato,
      logo: this.logoUrl,
      ubicacion: coords,
      creadaEn: '',
    };

    try {
      await this.jobService.crearOferta(oferta);
      this.snackbar.mostrar('Job offer posted successfully.', 'ok');
      await this.loadJobs();
      this.resetFormulario();
    } catch (error) {
      console.error('Error while posting the offer:', error);
      this.snackbar.mostrar('Error while saving the post.', 'error');
    }
  }

  cerrarModalOferta = () => {
    this.selectedOferta = null;
  };

  onOfertaEliminada() {
    this.selectedOferta = null;
    if (this.view !== 'map') {
      this.view = 'map';
    }
    this.loadJobs();
  }

  resetFormulario() {
    this.titulo = '';
    this.descripcion = '';
    this.salario = 0;
    this.tipoContrato = '';
    this.logoUrl = '';
    this.inicio = '';
    this.direccionTexto = '';
    this.direccionInvalida = false;

    this.selectedOferta = null;  // 🔥 limpiar oferta
    this.modoEdicion = false;    // 🔥 salir modo edición
    this.mostrarPopup = false;   // 🔥 cerrar popup
  }

  async loadJobs() {
    const snapshot = await this.jobService.getOfertas();
    this.jobs = snapshot.map((doc: any) => ({
      ...doc,
      id: doc.id,
    }));

    if (this.map) {
      this.marcadores.forEach((m) => this.map.removeLayer(m));
      this.marcadores = [];

      this.jobs.forEach((job) => {
        if (job.ubicacion?.lat && job.ubicacion?.lng) {
          const marker = L.marker([job.ubicacion.lat, job.ubicacion.lng], {
            icon: L.icon({
              iconUrl: job.logo,
              iconSize: [30, 30],
              iconAnchor: [15, 30],
              popupAnchor: [0, -30],
              className: 'custom-marker',
            }),
          });

          marker.addTo(this.map).on('click', () => {
            this.selectedOferta = job;
          });

          this.marcadores.push(marker);
        }
      });
    }
  }

  async ngAfterViewInit(): Promise<void> {
    if (!this.isBrowser) return;

    await this.userService.usuarioCargado;

    const { lat, lng } = this.userService.location;

    this.map = L.map('map').setView([lat, lng], 13);

    L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap contributors &copy; Carto',
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(this.map);

    // 🔥 IMPORTANTE: cargar ofertas tras el mapa
    await this.loadJobs();
  }

  abrirFormularioOferta() {
    this.resetFormulario();
    this.modoEdicion = false;    // 🔥 modo crear
    this.mostrarPopup = true;
  }

  editarOferta(oferta: Oferta & { id: string }) {
    this.resetFormulario();     // 🔥 importante limpiar antes
    this.selectedOferta = oferta;
    this.modoEdicion = true;     // 🔥 modo editar
    this.mostrarPopup = true;

    // Cargar datos en el formulario
    this.titulo = oferta.titulo;
    this.descripcion = oferta.descripcion;
    this.salario = oferta.salario;
    this.tipoContrato = oferta.tipoContrato;
    this.inicio = oferta.inicio;
    this.logoUrl = oferta.logo;
  }

  async guardarCambios() {
    if (!this.selectedOferta) {
      console.error('No offer selected for editing.');
      return;
    }

    try {
      const datosActualizados: Partial<Oferta> = {
        titulo: this.titulo,
        descripcion: this.descripcion,
        salario: this.salario,
        tipoContrato: this.tipoContrato,
        inicio: this.inicio,
        logo: this.logoUrl,
      };

      await this.jobService.actualizarOferta(this.selectedOferta.id, datosActualizados);
      this.snackbar.mostrar('Offer updated successfully.', 'ok');
      await this.loadJobs();
      this.resetFormulario();   // 🔥 importante resetear tras guardar
    } catch (error) {
      console.error('Error updating the offer:', error);
      this.snackbar.mostrar('Error saving changes.', 'error');
    }
  }

  async ngOnInit(): Promise<void> {
    await this.userService.usuarioCargado;
    await this.loadJobs();
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;

    if (tab === 'profile') {
      this.router.navigate(['/profile-settings']);
    } else if (tab === 'favourites') {
      this.router.navigate(['/favoritos']);
    } else if (tab === 'notifications') {
      this.router.navigate(['/notifications']);
    }
  }

  get isEmpresa() {
    return this.userService.role === 'empresa';
  }

  get isDesempleado() {
    return this.userService.role === 'desempleado';
  }

  logout() {
    this.authService.logout();
  }
}
