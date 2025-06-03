import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgIf } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FavoritosService } from '../../services/favoritos.service';
import { AplicacionesService } from '../../services/aplicaciones.service';
import { getAuth } from '@angular/fire/auth';
import { getDownloadURL, getStorage, ref } from 'firebase/storage';
import { Oferta } from '../../services/job.service';

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
  @Output() onOfertaEliminada = new EventEmitter<string>();
  @Output() onEditarOferta = new EventEmitter<Oferta & { id: string }>();

  favorito: boolean = false;
  yaAplicado: boolean = false;
  aplicando: boolean = false;
  esCreador: boolean = false;

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

    const auth = getAuth();

    auth.onAuthStateChanged((user) => {
      if (user && user.uid === this.empresaId) {
        this.esCreador = true;
      }
    });
  }

  editarOferta() {
    this.onEditarOferta.emit({
      id: this.idOferta,
      titulo: this.titulo,
      descripcion: this.descripcion,
      salario: this.salario,
      tipoContrato: this.tipoContrato,
      inicio: this.inicio,
      logo: this.logo,
      empresaId: this.empresaId,
      ubicacion: undefined!, // ignora esto, solo para tipado
      creadaEn: '',
    });

    this.onCerrar(); // cerrar modal
  }

  confirmarEliminar() {
    this.snackbar
      .open('Are you sure you want to delete this?', 'Confirm', {
        duration: 5000,
      })
      .onAction()
      .subscribe(() => {
        this.eliminarOferta();
      });
  }

  async eliminarOferta() {
    try {
      const db = (await import('@angular/fire/firestore')).getFirestore();
      const { doc, deleteDoc } = await import('firebase/firestore');
      await deleteDoc(doc(db, 'ofertas', this.idOferta));

      this.snackbar.open('Post deleted.', 'Close', {
        duration: 3000,
        panelClass: ['snackbar-success'],
      });

      this.onOfertaEliminada.emit(this.idOferta); // 🔥 Notificamos que se ha borrado
      this.onCerrar(); // Cerramos el modal
    } catch (error) {
      console.error('Error while deleting the post:', error);
      this.snackbar.open('Error while deleting the post.', 'Close', {
        duration: 3000,
      });
    }
  }

  async aplicar() {
    if (this.yaAplicado || this.aplicando) return;

    this.aplicando = true;
    const auth = getAuth();
    const user = auth.currentUser;
    const storage = getStorage();

    if (!user) {
      this.snackbar.open('You must be logged to apply.', 'Close', {
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

      this.snackbar.open(
        'You have succesfully applied to the position.',
        'Close',
        {
          duration: 3000,
          panelClass: ['snackbar-success'],
        }
      );

      this.yaAplicado = true;
    } catch (error: any) {
      console.error('Error while applying:', error);
      const msg = error?.message?.includes('storage')
        ? 'You must upload your CV before applying for a position.'
        : 'An error has ocurred.';
      this.snackbar.open(msg, 'Close', { duration: 4000 });
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
