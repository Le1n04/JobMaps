// importacion de decoradores y modulos de angular
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

// decorador que define el servicio como disponible en toda la aplicacion
@Injectable({
  providedIn: 'root',
})
export class SnackbarService {
  // inyeccion del servicio MatSnackBar
  constructor(private snackBar: MatSnackBar) {}

  // metodo para mostrar un snackbar con mensaje y tipo
  mostrar(mensaje: string, tipo: 'ok' | 'error' = 'ok', duracion = 3000) {
    this.snackBar.open(mensaje, 'Cerrar', {
      duration: duracion, // duracion del mensaje en milisegundos
      horizontalPosition: 'center', // posicion horizontal
      verticalPosition: 'bottom', // posicion vertical
      panelClass: tipo === 'ok' ? 'snackbar-ok' : 'snackbar-error', // clase css segun tipo
    });
  }
}
