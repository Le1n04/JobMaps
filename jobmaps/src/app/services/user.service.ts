// importacion de decoradores y funciones de firebase
import { Injectable } from '@angular/core';
import { getAuth, onAuthStateChanged, User } from '@angular/fire/auth';
import {
  doc,
  getDoc,
  getFirestore,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { BehaviorSubject } from 'rxjs';

// decorador que define el servicio como disponible en toda la aplicacion
@Injectable({
  providedIn: 'root',
})
export class UserService {
  // objeto para almacenar los datos del usuario
  private _userData: {
    email?: string;
    fullName?: string;
    age?: number;
    country?: string;
    acceptedTerms?: boolean;
    role?: 'empresa' | 'desempleado' | 'admin';
    location?: {
      lat: number;
      lng: number;
    };
    cvUrl?: string;
  } = {};

  // uid del usuario
  private _uid: string = '';
  // observable para notificar cambios en los datos del usuario
  private userData$ = new BehaviorSubject(this._userData);
  // promesa para indicar cuando se han cargado los datos del usuario
  usuarioCargado!: Promise<void>;
  private resolveUsuarioCargado!: () => void;

  // constructor: inicializa la promesa y carga los datos del usuario
  constructor() {
    this.usuarioCargado = new Promise((resolve) => {
      this.resolveUsuarioCargado = resolve;
    });
    this.loadUserFromFirebase();
  }

  // metodo para cargar los datos del usuario desde firebase
  async loadUserFromFirebase() {
    const auth = getAuth();
    const db = getFirestore();

    onAuthStateChanged(auth, async (user: User | null) => {
      if (user) {
        this._uid = user.uid;
        this._userData.email = user.email ?? 'no@email.error';
        if (!this._userData.fullName && user.displayName) {
          this._userData.fullName = user.displayName;
        }

        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          this._userData.age = data['age'] ?? 0;
          this._userData['cvUrl'] = data['cvUrl'] ?? '';
          this._userData.country = data['country'] ?? '';
          this._userData.role = data['role'] ?? 'desempleado';
          this._userData.location = data['location'] ?? {
            lat: 36.7213,
            lng: -4.4214,
          };
          this._userData.acceptedTerms = data['acceptedTerms'] ?? false;
        }

        this.userData$.next(this._userData); // notifica a los observadores
      } else {
        console.warn('No user logged in');
      }
      this.resolveUsuarioCargado(); // resuelve la promesa cuando termina
    });
  }

  // getter para obtener el cvUrl
  get cvUrl(): string {
    return (this._userData as any).cvUrl ?? '';
  }

  // getter para el observable de los datos del usuario
  get userDataObservable() {
    return this.userData$.asObservable();
  }

  // metodo para crear el documento de usuario en firestore
  async createUserDocument(uid: string, data: any) {
    const db = getFirestore();
    const userRef = doc(db, 'users', uid);
    await setDoc(userRef, data);
  }

  // getter para el uid del usuario
  get uid() {
    return this._uid;
  }

  // metodo para actualizar los datos del usuario en firestore
  async updateUserInFirestore(
    uid: string,
    newData: Partial<typeof this._userData>
  ) {
    const db = getFirestore();
    const docRef = doc(db, 'users', uid);
    await updateDoc(docRef, newData);

    // actualiza localmente
    this._userData = { ...this._userData, ...newData };
    this.userData$.next(this._userData);
  }

  // getters y setters para los datos del usuario
  set email(email: string) {
    this._userData.email = email;
  }

  get email() {
    return this._userData.email ?? 'no@email.error';
  }

  set role(role: 'empresa' | 'desempleado' | 'admin') {
    this._userData.role = role;
  }

  get role(): 'empresa' | 'desempleado' | 'admin' {
    return this._userData.role ?? 'desempleado';
  }

  set fullName(name: string) {
    this._userData.fullName = name;
  }

  get fullName() {
    return this._userData.fullName ?? 'Sin nombre';
  }

  set age(age: number) {
    this._userData.age = age;
  }

  get age() {
    return this._userData.age ?? 0;
  }

  set country(country: string) {
    this._userData.country = country;
  }

  get country() {
    return this._userData.country ?? '';
  }

  set acceptedTerms(value: boolean) {
    this._userData.acceptedTerms = value;
  }

  get acceptedTerms() {
    return this._userData.acceptedTerms ?? false;
  }

  setLocation(lat: number, lng: number) {
    this._userData.location = { lat, lng };
  }

  get location(): { lat: number; lng: number } {
    return this._userData.location ?? { lat: 36.7213, lng: -4.4214 };
  }

  get userData() {
    return this._userData;
  }

  // metodo para limpiar los datos del usuario
  clear() {
    this._userData = {};
    this._uid = '';
    this.userData$.next(this._userData);
  }
}
