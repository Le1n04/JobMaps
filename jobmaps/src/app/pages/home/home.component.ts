import { Component, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, NgIf, NgFor, CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { JobService, Job } from '../../services/job.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  imports: [MatIconModule, NgIf, NgFor, CommonModule],
})
export class HomeComponent implements AfterViewInit {
  view: 'map' | 'list' = 'map';
  activeTab: string = 'browse';
  isBrowser: boolean;
  jobs: Job[] = [
    {
      empresa: 'Cepsa',
      puesto: 'Dependiente gasolinera',
      distancia: 1.3,
      salario: 950,
      fecha: '2025-05-13T10:00:00Z',
      logo: 'https://cdn.worldvectorlogo.com/logos/cepsa-2.svg',
      lat: 36.7205,
      lng: -4.4193,
    },
    {
      empresa: 'Mercadona',
      puesto: 'Reponedor/a',
      distancia: 0.7,
      salario: 1050,
      fecha: '2025-05-30T10:00:00Z',
      logo: 'https://yt3.googleusercontent.com/ZrOQvWBGq2XrPuAzhwJp-UNjAEsHlfCBPN-8QCzsY9zjPrXRWW0IS4D6wK6KiP1SIGU6_2wqnw=s900-c-k-c0x00ffffff-no-rj',
      lat: 36.7228,
      lng: -4.4209,
    },
    {
      empresa: 'Burger King',
      puesto: 'Cocinero/a',
      distancia: 0.5,
      salario: 950,
      fecha: '2025-05-29T10:00:00Z',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Burger_King_logo_%281999%E2%80%932020%29.svg/250px-Burger_King_logo_%281999%E2%80%932020%29.svg.png',
      lat: 36.7239,
      lng: -4.4171,
    },
  ];

  constructor(
    @Inject(PLATFORM_ID) platformId: Object,
    private jobService: JobService,
    private authService: AuthService
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  async ngAfterViewInit(): Promise<void> {
    if (!this.isBrowser) return;

    const L = await import('leaflet');
    const map = L.map('map', { zoomControl: false }).setView(
      [36.7213, -4.4214],
      13
    );

    L.tileLayer(
      'https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png',
      {
        attribution: '&copy; OpenStreetMap contributors &copy; Carto',
        subdomains: 'abcd',
        maxZoom: 19,
      }
    ).addTo(map);

    this.jobs.forEach((job) => {
      if (job.lat && job.lng) {
        const icon = L.icon({
          iconUrl: job.logo,
          iconSize: [40, 40], // tamaño del icono
          iconAnchor: [20, 40], // punto "base" del icono (abajo centro)
          popupAnchor: [0, -40], // posición del popup con respecto al icono
          className: 'custom-marker',
        });

        L.marker([job.lat, job.lng], { icon })
          .addTo(map)
          .bindPopup(`<strong>${job.empresa}</strong><br>${job.puesto}`);
      }
    });
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  ngOnInit(): void {
    //this.loadJobs();
  }

  logout() {
    this.authService.logout();
  }

  /**private loadJobs() {
    this.jobService.getJobs().subscribe((data) => {
      this.jobs = data;
    });
  }**/
}
