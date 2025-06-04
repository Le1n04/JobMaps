// importacion de decoradores y clases de angular
import { Component, EventEmitter, Input, OnInit, OnDestroy, Output } from '@angular/core';
// importacion de modulo comun de angular
import { CommonModule } from '@angular/common';
// importacion de modulo de iconos de angular material
import { MatIconModule } from '@angular/material/icon';
// importacion del servicio de rutas de angular
import { Router } from '@angular/router';
// importacion de clase subscription de rxjs
import { Subscription } from 'rxjs';
// importacion del servicio de notificaciones
import { NotificacionesService } from '../../services/notificaciones.service';

// decorador que define las propiedades del componente
@Component({
  selector: 'app-bottom-nav', // selector para usar el componente en html
  standalone: true, // componente independiente
  imports: [CommonModule, MatIconModule], // modulos importados
  templateUrl: './bottom-nav.component.html', // ruta del template html
  styleUrls: ['./bottom-nav.component.scss'], // ruta de los estilos
})
export class BottomNavComponent implements OnInit, OnDestroy {
  // input para definir la pestaña activa desde el exterior
  @Input() activeTab: string = 'browse';
  // output para emitir cambios de pestaña
  @Output() tabChange = new EventEmitter<string>();

  // variable para indicar si hay notificaciones sin leer
  tieneNotificacionesSinLeer = false;
  // variable para guardar la suscripcion
  private notiSub!: Subscription;

  // inyeccion de dependencias: router y servicio de notificaciones
  constructor(
    private router: Router,
    private notificacionesService: NotificacionesService
  ) {}

  // metodo que se ejecuta al iniciar el componente
  ngOnInit(): void {
    // suscripcion al observable de notificaciones no leidas
    this.notiSub = this.notificacionesService.notificacionesNoLeidas$
      .subscribe((valor: boolean) => {
        this.tieneNotificacionesSinLeer = valor; // actualiza el estado local
      });
  }

  // metodo para cambiar la pestaña activa y navegar a la ruta correspondiente
  setActiveTab(tab: string) {
    this.activeTab = tab;
    this.router.navigate([`/${tab}`]);
  }

  // metodo que se ejecuta al destruir el componente
  ngOnDestroy(): void {
    // cancela la suscripcion para evitar fugas de memoria
    this.notiSub?.unsubscribe();
  }
}
