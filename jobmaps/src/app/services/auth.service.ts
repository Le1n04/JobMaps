import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  login(email: string, password: string) {
    return this.http.post(`${this.apiUrl}/login`, { email, password });
  }

  registro(data: any) {
    return this.http.post(`${this.apiUrl}/registro`, data);
  }

  getUsuario() {
    const raw = localStorage.getItem('usuario');
    return raw ? JSON.parse(raw) : null;
  }
  
  estaLogueado(): boolean {
    return !!localStorage.getItem('usuario');
  }
  
  cerrarSesion() {
    localStorage.removeItem('usuario');
  }
  
}
