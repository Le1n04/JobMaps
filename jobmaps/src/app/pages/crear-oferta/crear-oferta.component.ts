import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-crear-oferta',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './crear-oferta.component.html',
  styleUrls: ['./crear-oferta.component.scss'],
})
export class CrearOfertaComponent {
  titulo: string = '';
  descripcion: string = '';

  constructor(
    private userService: UserService,
    private router: Router
  ) {}

  async publicarOferta() {
    const db = getFirestore();
    const ofertasRef = collection(db, 'ofertas');

    const nuevaOferta = {
      titulo: this.titulo,
      descripcion: this.descripcion,
      empresaId: this.userService.uid,
      ubicacion: this.userService.location,
      creadaEn: serverTimestamp(),
    };

    try {
      await addDoc(ofertasRef, nuevaOferta);
      alert('✅ Oferta publicada correctamente.');
      this.router.navigate(['/home']);
    } catch (error) {
      console.error('❌ Error al publicar oferta:', error);
      alert('Ocurrió un error al guardar la oferta.');
    }
  }
}
