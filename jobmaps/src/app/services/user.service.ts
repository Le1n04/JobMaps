import { Injectable } from '@angular/core';

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
    return this._userData.role ?? 'desempleado'; // por defecto, si no se ha establecido
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
    return this._userData.location ?? { lat: 36.7213, lng: -4.4214 }; // Málaga centro por defecto
  }

  get userData() {
    return this._userData;
  }

  clear() {
    this._userData = {};
  }
}
