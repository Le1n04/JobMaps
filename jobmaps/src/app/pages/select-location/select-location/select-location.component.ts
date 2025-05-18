import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import * as L from 'leaflet';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-select-location',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './select-location.component.html',
  styleUrls: ['./select-location.component.scss']
})
export class SelectLocationComponent implements AfterViewInit {
  private map!: L.Map;
  private marker!: L.Marker;

  constructor(private router: Router, private userService: UserService) {}

  ngAfterViewInit(): void {
    // Define un icono personalizado
    const customIcon = L.icon({
      iconUrl: 'assets/marker.png',
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32]
    });

    this.map = L.map('manual-map').setView([36.7213, -4.4214], 13); // Málaga por defecto

    L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);

    // Usa el icono personalizado
    this.marker = L.marker([36.7213, -4.4214], {
      draggable: true,
      icon: customIcon
    }).addTo(this.map);

    this.map.on('click', (e: L.LeafletMouseEvent) => {
      this.marker.setLatLng(e.latlng);
    });
  }

  confirmarUbicacion() {
    const coords = this.marker.getLatLng();
    this.userService.setLocation(coords.lat, coords.lng);
    this.router.navigate(['/register-password']);
  }

  goBack() {
    this.router.navigate(['/register-location']);
  }
}
