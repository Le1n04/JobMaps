import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { NgIf, NgFor } from '@angular/common';
import { JobService, OfertaConId } from '../../services/job.service';
import { FavoritosService } from '../../services/favoritos.service';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { OfertaDetalleComponent } from '../../components/oferta-detalle/oferta-detalle.component';

@Component({
  selector: 'app-favoritos-page',
  standalone: true,
  imports: [CommonModule, NgIf, NgFor, MatIconModule, OfertaDetalleComponent],
  templateUrl: './favoritos-page.component.html',
  styleUrls: ['./favoritos-page.component.scss'],
})
export class FavoritosPageComponent implements OnInit {
  ofertas: OfertaConId[] = [];
  activeTab = 'favourites';
  selectedOferta: OfertaConId | null = null;

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

  cerrarModalOferta = () => {
    this.selectedOferta = null;
  };

  goBack() {
    this.location.back();
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
