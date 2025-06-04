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

@Injectable({
  providedIn: 'root',
})
export class UserService {
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

  private _uid: string = '';
  private userData$ = new BehaviorSubject(this._userData);
  usuarioCargado!: Promise<void>;
  private resolveUsuarioCargado!: () => void;

  constructor() {
    this.usuarioCargado = new Promise((resolve) => {
      this.resolveUsuarioCargado = resolve;
    });
    this.loadUserFromFirebase();
  }

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

        this.userData$.next(this._userData); // Notificar a los observadores
      } else {
        console.warn('No user logged in');
      }
      this.resolveUsuarioCargado();
    });
    
  }

  get cvUrl(): string {
    return (this._userData as any).cvUrl ?? '';
  }


  // 🔁 Observable (opcional)
  get userDataObservable() {
    return this.userData$.asObservable();
  }

  async createUserDocument(uid: string, data: any) {
    const db = getFirestore();
    const userRef = doc(db, 'users', uid);
    await setDoc(userRef, data);
  }

  // 🔐 UID del usuario actual
  get uid() {
    return this._uid;
  }

  // 💾 Actualizar Firestore
  async updateUserInFirestore(
    uid: string,
    newData: Partial<typeof this._userData>
  ) {
    const db = getFirestore();
    const docRef = doc(db, 'users', uid);
    await updateDoc(docRef, newData);

    // También actualizamos localmente
    this._userData = { ...this._userData, ...newData };
    this.userData$.next(this._userData);
  }

  // Getters y setters
  set email(email: string) {
    this._userData.email = email;
  }

  get email() {
    return this._userData.email ?? 'no@email.error';
  }

  set role(role: 'empresa' | 'desempleado') {
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

  clear() {
    this._userData = {};
    this._uid = '';
    this.userData$.next(this._userData);
  }
}
