import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

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
  history?: {
    semaine?: number;
    jours?: {
      date: string;
      day: string;
      month: string;
      week: number;
      arrival_date: string | null;
      last_departure: string | null;
      [key: string]: any;
    }[];
    [key: string]: any;
  };
}
export interface PaginatedUsers {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  users: Employe[];  // Cette ligne assure que la propriété 'users' est bien un tableau d'Employe
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  public apiUrl = environment.apiUrl; // Base URL de l'API

  constructor(private http: HttpClient) {}

  GetUsers(page: number = 1, perPage: number | string = 3): Observable<PaginatedUsers> {
    return this.http.get<PaginatedUsers>(`${this.apiUrl}/users?page=${page}&per_page=${perPage}`);
  }
  


  // Récupérer un utilisateur par ID
  GetUserServiceByid(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/users/${id}`);
  }

  // Ajouter un nouvel utilisateur
  AddUser(formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, formData);
  }

  // Mettre à jour un utilisateur
  updateUser(data: any, userId: number): Observable<any> {
    const token = localStorage.getItem('token'); // Récupérer le token depuis localStorage
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.put(`${this.apiUrl}/users/${userId}`, data, { headers });
  }

 
  // Enregistrer une arrivée
  registerArrival(userId: number, arrivalData: any): Observable<any> {
    const token = localStorage.getItem('token'); // Récupérer le token depuis le localStorage
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`, // Inclure le token dans les en-têtes
    });

    return this.http.post(
      `${this.apiUrl}/users/${userId}/pointages/arrivee`,
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
      `${this.apiUrl}/users/${userId}/pointages/depart`,
      departureData,
      { headers }
    );
  }

  // Récupérer l'historique des pointages d'un utilisateur
  getUserHistory(userId: number): Observable<any> {
    const token = localStorage.getItem('token'); // Récupérer le token depuis localStorage
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get(
      `${this.apiUrl}/users/${userId}/pointages/historique`,
      { headers }
    );
  }

 // Récupérer le compteur actif d'un utilisateur
 getActiveCounter(userId: number): Observable<any> {
  const token = localStorage.getItem('token'); // Récupérer le token depuis localStorage
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

  return this.http.get(
    `${this.apiUrl}/users/${userId}/pointages/active-counters`,
    { headers }
  );
}
  getGlobalTotalHours(userId: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  
    return this.http.get(`${this.apiUrl}/users/${userId}/total-hours`, { headers });
  }
  DeleteService(userId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}users/${userId}`);
  }
  
  // Mettre à jour un pointage
  updatePointage(userId: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/users/${userId}/pointages/edit`, data);
  }

  downloadMonthlyReport(selectedMonth: string): Observable<Blob> {
    const url = `${this.apiUrl}export-csv?month=${selectedMonth}`;
    return this.http.get(url, { responseType: 'blob' });
  }
  
  searchUsers(searchQuery: string, perPage: number, page: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/search-users`, {
      params: {
        search: searchQuery,
        per_page: perPage.toString(),
        page: page.toString()
      }
    });
  }
  
  /* leaves*/

  get(endpoint: string): Observable<any> {
    return this.http.get(`${this.apiUrl}${endpoint}`);
  }

  post(endpoint: string, data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}${endpoint}`, data);
  }

  put(endpoint: string, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}${endpoint}`, data);
  }

  delete(endpoint: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}${endpoint}`);
  }
  
  
}
