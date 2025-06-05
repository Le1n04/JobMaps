// importacion de decoradores y modulos de angular
import { Component, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, NgIf, NgFor, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
// importacion de servicios personalizados
import { AuthService } from '../../services/auth.service';
import { JobService, Oferta } from '../../services/job.service';
import { SnackbarService } from '../../services/snackbar.service';
import { OfertaDetalleComponent } from '../../components/oferta-detalle/oferta-detalle.component';
import { NotificacionesEmpresaComponent } from '../notificaciones-empresa/notificaciones-empresa.component';
import { BottomNavComponent } from '../../components/bottom-nav/bottom-nav.component';
import { UserService } from '../../services/user.service';
// importacion de leaflet para mapas
import * as L from 'leaflet';

// decorador que define las propiedades del componente
@Component({
  selector: 'app-home', // selector para usar el componente en html
  standalone: true, // componente independiente
  templateUrl: './home.component.html', // ruta del template html
  styleUrl: './home.component.scss', // ruta del archivo de estilos
  imports: [
    CommonModule,
    NgIf,
    NgFor,
    FormsModule,
    MatIconModule,
    OfertaDetalleComponent,
    NotificacionesEmpresaComponent,
    BottomNavComponent,
  ],
})
export class HomeComponent implements AfterViewInit {
  // variables para gestionar el estado de la pagina
  view: 'map' | 'list' = 'map';
  activeTab: string = 'browse';
  isBrowser: boolean;
  mostrarPopup = false;
  mostrarPopupEdicion = false;
  map!: L.Map;
  marcadores: L.Marker[] = [];
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
  jobs: (Oferta & { id: string })[] = [];

  // inyeccion de dependencias
  constructor(
    @Inject(PLATFORM_ID) platformId: Object,
    private jobService: JobService,
    private authService: AuthService,
    private snackbar: SnackbarService,
    public userService: UserService,
    private router: Router
  ) {
    this.isBrowser = isPlatformBrowser(platformId); // verifica si es navegador
  }

  // metodo para convertir direccion a coordenadas usando openstreetmap
  async convertirDireccionACoordenadas(
    direccion: string
  ): Promise<{ lat: number; lng: number } | null> {
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

  // metodo para crear una nueva oferta
  async crearOferta() {
    this.direccionInvalida = false;

    const coords = await this.convertirDireccionACoordenadas(
      this.direccionTexto
    );

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

  // metodo para cerrar el modal de oferta
  cerrarModalOferta = () => {
    this.selectedOferta = null;
    this.mostrarPopup = false;
  };

  // metodo para cerrar el popup de edicion
  cerrarPopupEdicion() {
    this.edicionOferta = null;
    this.mostrarPopupEdicion = false;
  }

  // metodo que se ejecuta cuando una oferta es eliminada
  onOfertaEliminada() {
    this.selectedOferta = null;
    if (this.view !== 'map') {
      this.view = 'map';
    }
    this.loadJobs();
  }

  // metodo para limpiar el formulario
  resetFormulario() {
    this.titulo = '';
    this.descripcion = '';
    this.salario = 0;
    this.tipoContrato = '';
    this.logoUrl = '';
    this.inicio = '';
    this.direccionTexto = '';
    this.direccionInvalida = false;
    this.selectedOferta = null;
    this.edicionOferta = null;
  }

  // metodo para cargar las ofertas y actualizar el mapa
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

  // metodo que se ejecuta despues de que la vista esta inicializada
  async ngAfterViewInit(): Promise<void> {
    if (!this.isBrowser) return;

    await this.userService.usuarioCargado;

    const { lat, lng } = this.userService.location;

    this.map = L.map('map', {zoomControl: false}).setView([lat, lng], 13);

    L.tileLayer(
      'https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png',
      {
        attribution: '&copy; OpenStreetMap contributors &copy; Carto',
        subdomains: 'abcd',
        maxZoom: 19,
        
      }
    ).addTo(this.map);

    await this.loadJobs();
  }

  // metodo para abrir el formulario de nueva oferta
  abrirFormularioOferta() {
    this.resetFormulario();
    this.mostrarPopup = true;
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
    this.direccionTexto = '';
  }

  // metodo para cambiar la pestaña activa y navegar a la ruta correspondiente
  setActiveTab(tab: string) {
    this.activeTab = tab;

    if (tab === 'profile') {
      this.router.navigate(['/profile-settings']);
    } else if (tab === 'favourites') {
      this.router.navigate(['/favoritos']);
    } else if (tab === 'notifications') {
      this.router.navigate(['/notifications']);
    } else if (tab === 'browse') {
      if (this.view === 'map' && this.map) {
        setTimeout(() => {
          this.map.invalidateSize();
        }, 200);
      }
    }
  }

  // metodo para cambiar entre la vista de mapa o lista
  setView(newView: 'map' | 'list') {
    this.view = newView;

    if (newView === 'map' && this.map) {
      setTimeout(() => {
        this.map.invalidateSize();
      }, 200);
    }
  }

  // metodo para guardar cambios en una oferta editada
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

      this.snackbar.mostrar('Offer updated successfully.', 'ok');
      this.cerrarPopupEdicion();
      await this.loadJobs();
    } catch (error) {
      console.error('Error updating the offer:', error);
      this.snackbar.mostrar('Error while updating the offer.', 'error');
    }
  }

  // metodo para navegar al dashboard de administracion
  irDashboardAdmin() {
    this.router.navigate(['/admin']);
  }

  // metodo que se ejecuta al iniciar el componente
  async ngOnInit(): Promise<void> {
    await this.userService.usuarioCargado;
    await this.loadJobs();
  }

  // getters para verificar el rol del usuario
  get isEmpresa() {
    return this.userService.role === 'empresa';
  }

  get isDesempleado() {
    return this.userService.role === 'desempleado';
  }

  get isAdmin() {
    return this.userService.role === 'admin';
  }

  // metodo para cerrar sesion
  logout() {
    this.authService.logout();
  }
}
