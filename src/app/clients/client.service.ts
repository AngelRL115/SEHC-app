import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Client {
  idclient: number;
  name: string;
  lastName: string;
  phone: string;
  invoice: boolean;
  socialReazon: string | null;
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
  private apiUrl = 'http://localhost:3000/SEHC/client/getAllClients';

  constructor(private http: HttpClient) { }

  getAllClients(): Observable<Client[]> {
    return this.http.get<Client[]>(this.apiUrl);
  }
}
