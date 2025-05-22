import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgIf } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FavoritosService } from '../../services/favoritos.service';

@Component({
  selector: 'app-oferta-detalle',
  standalone: true,
  imports: [CommonModule, NgIf, MatIconModule],
  templateUrl: './oferta-detalle.component.html',
  styleUrls: ['./oferta-detalle.component.scss'],
})
export class OfertaDetalleComponent implements OnInit {
  @Input() titulo = '';
  @Input() descripcion = '';
  @Input() salario = 0;
  @Input() tipoContrato = '';
  @Input() inicio = '';
  @Input() logo = '';
  @Input() idOferta = ''; // 🆕 ID de la oferta
  @Input() onCerrar: () => void = () => {};

  favorito: boolean = false;

  constructor(private favoritosService: FavoritosService) {}

  async ngOnInit(): Promise<void> {
    if (this.idOferta) {
      this.favorito = await this.favoritosService.isFavorito(this.idOferta);
    }
  }

  toggleFavorito() {
    this.favorito = !this.favorito;

    if (this.favorito) {
      this.favoritosService.addFavorito(this.idOferta);
    } else {
      this.favoritosService.removeFavorito(this.idOferta);
    }
  }
}
