import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Vehicle {
  idVehicle: number;
  cliente_idcliente: number;
  brand: string;
  model: string;
  year: string;
  color: string;
  plate: string;
  doors: number;
  motor: string;
  createdAt: string;
  updatedAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class CarRegistrationService {

  private apiUrl = 'http://localhost:3000/SEHC/vehicle/getAllVehicles';

  constructor(private http: HttpClient) { }

  getAllVehicles(): Observable<Vehicle[]> {
    return this.http.get<Vehicle[]>(this.apiUrl);
  }
}
