// importacion de decoradores y modulos de angular
import { Component, AfterViewInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
// importacion de leaflet para mapas
import * as L from 'leaflet';
// importacion del servicio de usuario
import { UserService } from '../../../services/user.service';

// decorador que define las propiedades del componente
@Component({
  selector: 'app-select-location', // selector para usar el componente en html
  standalone: true, // componente independiente
  imports: [CommonModule], // modulos importados
  templateUrl: './select-location.component.html', // ruta del template html
  styleUrls: ['./select-location.component.scss'],
})
export class SelectLocationComponent implements AfterViewInit {
  // variables para el mapa y el marcador
  private map!: L.Map;
  private marker!: L.Marker;
  // variable para saber desde donde se llama al componente
  from: 'profile' | 'register' | 'crear-oferta' = 'register';

  // inyeccion de dependencias: route, router, userService y location
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private location: Location
  ) {}

  // metodo que se ejecuta al iniciar el componente
  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      const origen = params['from'];
      if (origen === 'profile' || origen === 'crear-oferta') {
        this.from = origen;
      }
    });
  }

  // metodo que se ejecuta despues de que la vista esta inicializada
  ngAfterViewInit(): void {
    const customIcon = L.icon({
      iconUrl: 'assets/marker.png',
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32],
    });

    const fallbackCoords: L.LatLngExpression = [36.7213, -4.4214]; // coordenadas por defecto
    this.map = L.map('manual-map');

    L.tileLayer(
      'https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png',
      {
        attribution: '&copy; OpenStreetMap contributors',
      }
    ).addTo(this.map);

    // obtiene la ubicacion actual del usuario
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
        this.map.setView(fallbackCoords, 13);
        this.marker = L.marker(fallbackCoords, {
          draggable: true,
          icon: customIcon,
        }).addTo(this.map);
      }
    );

    // permite cambiar la posicion del marcador al hacer click en el mapa
    this.map.on('click', (e: L.LeafletMouseEvent) => {
      this.marker.setLatLng(e.latlng);
    });
  }

  // metodo para confirmar la ubicacion seleccionada
  confirmarUbicacion() {
    const coords = this.marker.getLatLng();

    // guarda la ubicacion en localstorage temporalmente
    localStorage.setItem(
      'ubicacionOferta',
      JSON.stringify({
        lat: coords.lat,
        lng: coords.lng,
      })
    );

    // redirige segun desde donde se abrio el componente
    if (this.from === 'crear-oferta') {
      this.router.navigate(['/home']);
    } else if (this.from === 'profile') {
      this.userService.setLocation(coords.lat, coords.lng);
      this.router.navigate(['/profile-settings']);
    } else {
      this.userService.setLocation(coords.lat, coords.lng);
      this.router.navigate(['/register-password']);
    }
  }

  // metodo para volver a la pagina anterior
  goBack() {
    this.location.back();
  }
}
