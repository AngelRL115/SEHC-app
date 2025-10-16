import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Client {
  idclient: number;
  name: string;
  lastName: string;
  phone: string;
  invoice: boolean;
  socialReason: string | null;
  zipcode: string | null;
  fiscalRegimen: string | null;
  email: string | null;
  createdAt: string;
  updatedAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private apiUrl = 'http://localhost:3000/SEHC/client';

  constructor(private http: HttpClient) { }

  getAllClients(): Observable<Client[]> {
    return this.http.get<Client[]>(`${this.apiUrl}/getAllClients`);
  }

  newClient(client: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/newClient`, client);
  }

  newVehicle(vehicle: any): Observable<any> {
    return this.http.post<any>('http://localhost:3000/SEHC/vehicle/newVehicle', vehicle);
  }

  deleteClient(id: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/deleteClient`, { idClient: id });
  }

  updateClientDetails(data: any): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/updateClientDetails`, data);
  }
}