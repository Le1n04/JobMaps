// importacion de decoradores y funciones de firebase
import { Injectable } from '@angular/core';
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
} from 'firebase/firestore';

// definicion de la interfaz oferta
export interface Oferta {
  titulo: string;
  descripcion: string;
  empresaId: string;
  creadaEn: any;
  inicio: string;
  salario: number;
  tipoContrato: string;
  logo: string;
  ubicacion: {
    lat: number;
    lng: number;
  };
}

// tipo extendido para incluir el id del documento
export type OfertaConId = Oferta & { id: string };

// decorador que define el servicio como disponible en toda la aplicacion
@Injectable({
  providedIn: 'root',
})
export class JobService {
  // instancia de firestore
  private db = getFirestore();

  constructor() {}

  // metodo para obtener todas las ofertas
  async getOfertas(): Promise<OfertaConId[]> {
    const ofertasRef = collection(this.db, 'ofertas');
    const snapshot = await getDocs(ofertasRef);

    // mapea los documentos agregando el id y convirtiendo la fecha
    return snapshot.docs.map((doc) => ({
      ...(doc.data() as Oferta),
      id: doc.id,
      creadaEn: doc.data()['creadaEn']?.toDate?.() || new Date(),
    }));
  }

  // metodo para crear una nueva oferta
  async crearOferta(oferta: Oferta) {
    const ofertasRef = collection(this.db, 'ofertas');
    return await addDoc(ofertasRef, {
      ...oferta,
      creadaEn: serverTimestamp(), // agrega la marca de tiempo del servidor
    });
  }

  // metodo para actualizar una oferta existente
  async actualizarOferta(id: string, data: Partial<Oferta>) {
    console.log('Actualizando oferta con ID:', id, 'y datos:', data);
    const { doc, updateDoc } = await import('firebase/firestore');
    const ref = doc(this.db, 'ofertas', id);
    return updateDoc(ref, data);
  }
}
