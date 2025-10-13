import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // TODO: Reemplaza esta URL con la de tu endpoint de login real
  private apiUrl = 'http://localhost:3000/SEHC/auth/login';
  private tokenKey = 'auth_token';
  private usernameKey = 'auth_username';

  constructor(private http: HttpClient, private router: Router) { }

  login(credentials: { username: string }): Observable<any> {
    // Guardar el nombre de usuario en localStorage
    localStorage.setItem(this.usernameKey, credentials.username);

    return this.http.post<any>(this.apiUrl, credentials).pipe(
      tap(response => {
        // Asume que el backend regresa un objeto con una propiedad 'token'
        if (response && response.token) {
          this.saveToken(response.token);
        }
      }),
      catchError(error => {
        console.error('Error en el login:', error);
        // Limpiar el nombre de usuario si el login falla
        localStorage.removeItem(this.usernameKey);
        // Devuelve un observable de error para que el componente pueda manejarlo
        throw error;
      })
    );
  }

  saveToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(this.tokenKey);
    }
    return null;
  }

  getUsername(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(this.usernameKey);
    }
    return null;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.usernameKey);
    this.router.navigate(['/login']);
  }

  createUser(userData: { name: string, lastName: string, username: string }): Observable<any> {
    // TODO: Reemplaza esta URL con la de tu endpoint de creación de usuarios real
    const createUserApiUrl = 'http://localhost:3000/SEHC/auth/registerUser';
    return this.http.post<any>(createUserApiUrl, userData).pipe(
      catchError(error => {
        console.error('Error al crear usuario:', error);
        throw error;
      })
    );
  }
}