import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgIf } from '@angular/common';
import { HomeComponent } from '../../pages/home/home.component';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-oferta-detalle',
  standalone: true,
  imports: [CommonModule, NgIf, MatIconModule],
  templateUrl: './oferta-detalle.component.html',
  styleUrls: ['./oferta-detalle.component.scss'],
})
export class OfertaDetalleComponent {
  @Input() titulo = '';
  @Input() descripcion = '';
  @Input() salario = 0;
  @Input() tipoContrato = '';
  @Input() inicio = '';
  @Input() logo = '';
  @Input() onCerrar: () => void = () => {};

  favorito: boolean = false;

  toggleFavorito() {
    this.favorito = !this.favorito;
  }
}
