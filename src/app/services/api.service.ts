import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

// Interface pour les données d'un utilisateur
interface Employe {
  name: string;
  email: string;
  sexe: string;
  role: string;
  password: string;
  password_confirmation?: string;
  profile_image?: File; // Utiliser File pour les images
  total_time_seconds?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  public apiUrl = "http://127.0.0.1:8000/api/"; // Base URL de l'API

  constructor(private http: HttpClient) {}

  // Récupérer la liste des utilisateurs
  GetUsers(): Observable<{ users: Employe[] }> {
    return this.http.get<{ users: Employe[] }>(`${this.apiUrl}users`);
  }

  // Récupérer un utilisateur par ID
  GetUserServiceByid(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}users/${id}`);
  }

  // Ajouter un nouvel utilisateur
  AddUser(formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}register`, formData);
  }

  // Mettre à jour un utilisateur
  updateUser(data: any, userId: number): Observable<any> {
    const token = localStorage.getItem('token'); // Récupérer le token depuis localStorage
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.put(`${this.apiUrl}users/${userId}`, data, { headers });
  }

 
  // Enregistrer une arrivée
  registerArrival(userId: number, arrivalData: any): Observable<any> {
    const token = localStorage.getItem('token'); // Récupérer le token depuis le localStorage
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`, // Inclure le token dans les en-têtes
    });

    return this.http.post(
      `${this.apiUrl}users/${userId}/pointages/arrivee`,
      arrivalData,
      { headers }
    );
  }

  // Enregistrer un départ
  registerDeparture(userId: number, departureData: any): Observable<any> {
    const token = localStorage.getItem('token'); // Récupérer le token depuis le localStorage
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`, // Inclure le token dans les en-têtes
    });

    return this.http.post(
      `${this.apiUrl}users/${userId}/pointages/depart`,
      departureData,
      { headers }
    );
  }

  // Récupérer l'historique des pointages d'un utilisateur
  getUserHistory(userId: number): Observable<any> {
    const token = localStorage.getItem('token'); // Récupérer le token depuis localStorage
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get(
      `${this.apiUrl}users/${userId}/pointages/historique`,
      { headers }
    );
  }

 // Récupérer le compteur actif d'un utilisateur
 getActiveCounter(userId: number): Observable<any> {
  const token = localStorage.getItem('token'); // Récupérer le token depuis localStorage
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

  return this.http.get(
    `${this.apiUrl}users/${userId}/pointages/active-counters`,
    { headers }
  );
}
  getGlobalTotalHours(userId: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  
    return this.http.get(`${this.apiUrl}users/${userId}/total-hours`, { headers });
  }
  
}
