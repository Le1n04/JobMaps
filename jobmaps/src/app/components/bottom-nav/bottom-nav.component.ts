import { Component, EventEmitter, Input, OnInit, OnDestroy, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { NotificacionesService } from '../../services/notificaciones.service';

@Component({
  selector: 'app-bottom-nav',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './bottom-nav.component.html',
  styleUrls: ['./bottom-nav.component.scss'],
})
export class BottomNavComponent implements OnInit, OnDestroy {
  @Input() activeTab: string = 'browse';
  @Output() tabChange = new EventEmitter<string>();

  tieneNotificacionesSinLeer = false;
  private notiSub!: Subscription;

  constructor(
    private router: Router,
    private notificacionesService: NotificacionesService
  ) {}

  ngOnInit(): void {
    this.notiSub = this.notificacionesService.notificacionesNoLeidas$
      .subscribe((valor: boolean) => {
        this.tieneNotificacionesSinLeer = valor;
      });
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
    this.router.navigate([`/${tab}`]);
  }

  ngOnDestroy(): void {
    this.notiSub?.unsubscribe();
  }
}
