import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgIf } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FavoritosService } from '../../services/favoritos.service';
import { AplicacionesService } from '../../services/aplicaciones.service';
import { getAuth } from '@angular/fire/auth';
import { getDownloadURL, getStorage, ref } from 'firebase/storage';

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
  @Input() idOferta = '';
  @Input() empresaId = ''; // 🆕
  @Input() onCerrar: () => void = () => {};
  @Output() onEliminarFavorito = new EventEmitter<string>();

  favorito: boolean = false;
  yaAplicado: boolean = false;
  aplicando: boolean = false;

  constructor(
    private favoritosService: FavoritosService,
    private aplicacionesService: AplicacionesService,
    private snackbar: MatSnackBar
  ) {}

  async ngOnInit(): Promise<void> {
    if (this.idOferta) {
      this.favorito = await this.favoritosService.isFavorito(this.idOferta);
      this.yaAplicado = await this.aplicacionesService.yaHaAplicado(
        this.idOferta
      );
    }
  }

  async aplicar() {
    if (this.yaAplicado || this.aplicando) return;

    this.aplicando = true;
    const auth = getAuth();
    const user = auth.currentUser;
    const storage = getStorage();

    if (!user) {
      this.snackbar.open('Debes estar logueado para aplicar.', 'Cerrar', {
        duration: 3000,
      });
      this.aplicando = false;
      return;
    }

    const cvPath = `cvs/${user.uid}/cv.pdf`;
    const fileRef = ref(storage, cvPath);

    try {
      // ✅ Comprobar si el CV existe
      await getDownloadURL(fileRef);

      // ✅ Aplicar a la oferta y enviar notificación
      await this.aplicacionesService.aplicarAOferta(
        this.idOferta,
        this.empresaId,
        this.titulo
      );

      this.snackbar.open('Has aplicado correctamente a la oferta.', 'Cerrar', {
        duration: 3000,
        panelClass: ['snackbar-success'],
      });

      this.yaAplicado = true;
    } catch (error: any) {
      console.error('Error al aplicar:', error);
      const msg = error?.message?.includes('storage')
        ? 'Debes subir tu CV en el perfil antes de aplicar a una oferta.'
        : 'Ocurrió un error al aplicar.';
      this.snackbar.open(msg, 'Cerrar', { duration: 4000 });
    }

    this.aplicando = false;
  }

  toggleFavorito() {
    this.favorito = !this.favorito;

    if (this.favorito) {
      this.favoritosService.addFavorito(this.idOferta);
    } else {
      this.favoritosService.removeFavorito(this.idOferta);
      this.onEliminarFavorito.emit(this.idOferta);
    }
  }
}
