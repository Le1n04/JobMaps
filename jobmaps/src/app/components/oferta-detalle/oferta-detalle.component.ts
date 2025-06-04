// importacion de decoradores y clases de angular
import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
// importacion de modulos comunes de angular
import { CommonModule } from '@angular/common';
import { NgIf } from '@angular/common';
// importacion de modulo de iconos de angular material
import { MatIconModule } from '@angular/material/icon';
// importacion del servicio de snackbar para notificaciones
import { MatSnackBar } from '@angular/material/snack-bar';
// importacion de servicios personalizados
import { FavoritosService } from '../../services/favoritos.service';
import { AplicacionesService } from '../../services/aplicaciones.service';
// importacion de autenticacion y almacenamiento de firebase
import { getAuth } from '@angular/fire/auth';
import { getDownloadURL, getStorage, ref } from 'firebase/storage';
// importacion del tipo oferta
import { Oferta } from '../../services/job.service';

// decorador que define las propiedades del componente
@Component({
  selector: 'app-oferta-detalle', // selector para usar el componente en html
  standalone: true, // componente independiente
  imports: [CommonModule, NgIf, MatIconModule], // modulos importados
  templateUrl: './oferta-detalle.component.html', // ruta del template html
  styleUrls: ['./oferta-detalle.component.scss'], // ruta de los estilos
})
export class OfertaDetalleComponent implements OnInit {
  // propiedades de entrada para configurar el componente
  @Input() titulo = '';
  @Input() descripcion = '';
  @Input() salario = 0;
  @Input() tipoContrato = '';
  @Input() inicio = '';
  @Input() logo = '';
  @Input() idOferta = '';
  @Input() empresaId = '';
  @Input() onCerrar: () => void = () => {};
  // eventos de salida para emitir acciones al componente padre
  @Output() onEliminarFavorito = new EventEmitter<string>();
  @Output() onOfertaEliminada = new EventEmitter<string>();
  @Output() onEditarOferta = new EventEmitter<Oferta & { id: string }>();

  // variables de estado interno
  favorito: boolean = false;
  yaAplicado: boolean = false;
  aplicando: boolean = false;
  esCreador: boolean = false;

  // inyeccion de dependencias: servicios y snackbar
  constructor(
    private favoritosService: FavoritosService,
    private aplicacionesService: AplicacionesService,
    private snackbar: MatSnackBar
  ) {}

  // metodo que se ejecuta al iniciar el componente
  async ngOnInit(): Promise<void> {
    // verifica si la oferta esta en favoritos
    if (this.idOferta) {
      this.favorito = await this.favoritosService.isFavorito(this.idOferta);
      this.yaAplicado = await this.aplicacionesService.yaHaAplicado(
        this.idOferta
      );
    }

    // obtiene el usuario autenticado y verifica si es el creador de la oferta
    const auth = getAuth();
    auth.onAuthStateChanged((user) => {
      if (user && user.uid === this.empresaId) {
        this.esCreador = true;
      }
    });
  }

  // metodo para emitir el evento de edicion de oferta
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
      ubicacion: undefined!, // ignorado para tipado
      creadaEn: '',
    });

    this.onCerrar(); // cierra el modal
  }

  // metodo para confirmar la eliminacion de una oferta
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

  // metodo para eliminar una oferta de la base de datos
  async eliminarOferta() {
    try {
      const db = (await import('@angular/fire/firestore')).getFirestore();
      const { doc, deleteDoc } = await import('firebase/firestore');
      await deleteDoc(doc(db, 'ofertas', this.idOferta));

      this.snackbar.open('Post deleted.', 'Close', {
        duration: 3000,
        panelClass: ['snackbar-success'],
      });

      this.onOfertaEliminada.emit(this.idOferta); // emite que se ha eliminado
      this.onCerrar(); // cierra el modal
    } catch (error) {
      console.error('Error while deleting the post:', error);
      this.snackbar.open('Error while deleting the post.', 'Close', {
        duration: 3000,
      });
    }
  }

  // metodo para aplicar a una oferta
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
      // verifica si el cv existe en el almacenamiento
      await getDownloadURL(fileRef);

      // aplica a la oferta y envia notificacion
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

  // metodo para alternar el estado de favorito
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
