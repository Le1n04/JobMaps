import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Job {
  lng: number;
  lat: number;
  empresa: string;
  puesto: string;
  distancia: number;
  salario: number;
  fecha: string;
  logo: string;
}

@Injectable({
  providedIn: 'root'
})
export class JobService {
  private apiUrl = 'https://TU_BACKEND_URL/api/jobs'; // <- cambiar cuando tengas backend

  constructor(private http: HttpClient) {}

  getJobs(): Observable<Job[]> {
    return this.http.get<Job[]>(this.apiUrl);
  }
}
