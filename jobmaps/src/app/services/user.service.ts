import { Injectable } from '@angular/core';
import { getAuth, onAuthStateChanged, User } from '@angular/fire/auth';
import { doc, getDoc, getFirestore } from 'firebase/firestore';

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
    role?: 'empresa' | 'desempleado';
    location?: {
      lat: number;
      lng: number;
    };
  } = {};

  constructor() {
    this.loadUserFromFirebase();
  }

  async loadUserFromFirebase() {
    const auth = getAuth();
    const db = getFirestore();

    onAuthStateChanged(auth, async (user: User | null) => {
      if (user) {
        this._userData.email = user.email ?? 'no@email.error';
        this._userData.fullName = user.displayName ?? 'Sin nombre';

        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          this._userData.age = data['age'] ?? 0;
          this._userData.country = data['country'] ?? '';
          this._userData.role = data['role'] ?? 'desempleado';
          this._userData.location = data['location'] ?? {
            lat: 36.7213,
            lng: -4.4214,
          };
          this._userData.acceptedTerms = data['acceptedTerms'] ?? false;
        }
      } else {
        console.warn('No user logged in');
      }
    });
  }

  // Getters y setters igual que los tuyos:

  set email(email: string) {
    this._userData.email = email;
  }

  get email() {
    return this._userData.email ?? 'no@email.error';
  }

  set role(role: 'empresa' | 'desempleado') {
    this._userData.role = role;
  }

  get role(): 'empresa' | 'desempleado' {
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
  }
}
