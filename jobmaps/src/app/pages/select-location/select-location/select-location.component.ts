import { Component, AfterViewInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import * as L from 'leaflet';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-select-location',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './select-location.component.html',
  styleUrls: ['./select-location.component.scss'],
})
export class SelectLocationComponent implements AfterViewInit {
  private map!: L.Map;
  private marker!: L.Marker;
  from: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private location : Location,
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.from = params['from'] || '';
    });
  }

  ngAfterViewInit(): void {
    const customIcon = L.icon({
      iconUrl: 'assets/marker.png',
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32],
    });

    // Fallback: Málaga
    const fallbackCoords: L.LatLngExpression = [36.7213, -4.4214];

    // Iniciar mapa sin centrar aún
    this.map = L.map('manual-map');

    // Capa base
    L.tileLayer(
      'https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png',
      {
        attribution: '&copy; OpenStreetMap contributors',
      }
    ).addTo(this.map);

    // Intentar geolocalización
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords: L.LatLngExpression = [
          position.coords.latitude,
          position.coords.longitude,
        ];
        this.map.setView(coords, 14);
        this.marker = L.marker(coords, {
          draggable: true,
          icon: customIcon,
        }).addTo(this.map);
      },
      () => {
        // Si falla la geolocalización, usar Málaga
        this.map.setView(fallbackCoords, 13);
        this.marker = L.marker(fallbackCoords, {
          draggable: true,
          icon: customIcon,
        }).addTo(this.map);
      }
    );

    // Al hacer clic en el mapa, mover el marcador
    this.map.on('click', (e: L.LeafletMouseEvent) => {
      this.marker.setLatLng(e.latlng);
    });
  }

  confirmarUbicacion() {
    const coords = this.marker.getLatLng();
    this.userService.setLocation(coords.lat, coords.lng);

    if (this.from === 'profile') {
      this.router.navigate(['/profile-settings']);
    } else {
      this.router.navigate(['/register-password']);
    }
  }

  goBack() {
    this.location.back();
  }
}
