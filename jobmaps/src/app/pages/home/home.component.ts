import { Component, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, NgIf, NgFor, CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { JobService, Oferta } from '../../services/job.service';
import { FormsModule } from '@angular/forms';
import * as L from 'leaflet';
import { OfertaDetalleComponent } from '../../components/oferta-detalle/oferta-detalle.component';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  imports: [
    MatIconModule,
    NgIf,
    NgFor,
    CommonModule,
    FormsModule,
    OfertaDetalleComponent,
  ],
})
export class HomeComponent implements AfterViewInit {
  view: 'map' | 'list' = 'map';
  activeTab: string = 'browse';
  isBrowser: boolean;
  mostrarPopup = false;
  map!: any;
  marcadores: any[] = [];
  direccionTexto: string = '';
  direccionInvalida = false;
  selectedOferta: Oferta | null = null;
  titulo: string = '';
  descripcion: string = '';
  salario: number = 0;
  tipoContrato: string = '';
  inicio: string = '';
  logoUrl: string = '';
  jobs: Oferta[] = [];

  constructor(
    @Inject(PLATFORM_ID) platformId: Object,
    private jobService: JobService,
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

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
      alert('✅ Oferta publicada correctamente.');
      await this.loadJobs(); // ← 🔄 recarga desde Firebase
      this.resetFormulario();
    } catch (error) {
      console.error('❌ Error al publicar la oferta:', error);
      alert('Error al guardar la oferta.');
    }
  }

  cerrarModalOferta = () => {
    console.log('cerrarModalOferta: ' + this.selectedOferta);
    this.selectedOferta = null;
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
    this.mostrarPopup = false;
  }

  async loadJobs() {
    const snapshot = await this.jobService.getOfertas();
    this.jobs = snapshot;

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

    const L = await import('leaflet');
    const { lat, lng } = this.userService.location;
    this.map = L.map('map').setView([lat, lng], 13);

    L.tileLayer(
      'https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png',
      {
        attribution: '&copy; OpenStreetMap contributors &copy; Carto',
        subdomains: 'abcd',
        maxZoom: 19,
      }
    ).addTo(this.map);
  }

  abrirFormularioOferta() {
    this.mostrarPopup = true;
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;

    if (tab === 'profile') {
      this.router.navigate(['/profile-settings']);
    }
  }

  ngOnInit(): void {
    this.loadJobs();
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
