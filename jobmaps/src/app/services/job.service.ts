import { Injectable } from '@angular/core';
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
} from 'firebase/firestore';

export interface Oferta {
  titulo: string;
  descripcion: string;
  empresaId: string;
  creadaEn: any;
  inicio: string; // ISO date string (ej: '2025-06-01')
  salario: number;
  tipoContrato: string;
  logo: string;
  ubicacion: {
    lat: number;
    lng: number;
  };
}

@Injectable({
  providedIn: 'root',
})
export class JobService {
  private db = getFirestore();

  constructor() {}

  async getOfertas(): Promise<Oferta[]> {
    const ofertasRef = collection(this.db, 'ofertas');
    const snapshot = await getDocs(ofertasRef);

    return snapshot.docs.map((doc) => ({
      ...(doc.data() as Oferta),
      creadaEn: doc.data()['creadaEn']?.toDate?.() || new Date(),
    }));
  }

  async crearOferta(oferta: Oferta) {
    const ofertasRef = collection(this.db, 'ofertas');
    return await addDoc(ofertasRef, {
      ...oferta,
      creadaEn: serverTimestamp(),
    });
  }
}
