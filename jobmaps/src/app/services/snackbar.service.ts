import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class SnackbarService {
  constructor(private snackBar: MatSnackBar) {}

  mostrar(mensaje: string, tipo: 'ok' | 'error' = 'ok', duracion = 3000) {
    this.snackBar.open(mensaje, 'Cerrar', {
      duration: duracion,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: tipo === 'ok' ? 'snackbar-ok' : 'snackbar-error',
    });
  }
}
