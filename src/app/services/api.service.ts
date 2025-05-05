import { HttpClient, HttpHeaders ,HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { catchError } from 'rxjs/operators';
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
export type Statut = 'todo' | 'in_progress' | 'done';

export interface Tache {
  id?: number;
  titre: string;
  description: string;
  statut: Statut;   // <- ici
  user_id: number;
  ordre: number;
  created_at?: string;
  updated_at?: string;
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
  
  getUsersnotpagination() {
    return this.http.get<any>(`${this.apiUrl}/usersall`);
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
    const url = `${this.apiUrl}/export-csv?month=${selectedMonth}`;
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

  // Récupérer les congés d'un utilisateur
  getLeavesForUser(userId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/leavesuser/${userId}`);
  }

  // Ajouter un congé
  addLeave(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/leaves`, data);
  }

  // Mettre à jour un congé
  updateLeave(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/leaves/${id}`, data);
  }

  // Supprimer un congé
  deleteLeave(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/leaves/${id}`);
  }

  // Approuver un congé (réservé à l'administrateur)
  approveLeave(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/leaves/${id}/approve`, {});
  }

  // Rejeter un congé
  rejectLeave(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/leaves/${id}/reject`, {});
  }
  
   /* message chat  */


// Fonction pour envoyer un message
  // Fonction pour envoyer un message
  sendMessage(message: string, receiverId: number): Observable<any> {
    const userToken = localStorage.getItem('auth_token');  // Récupère le token d'authentification de l'utilisateur, si disponible.

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${userToken}`, // Ajoute le token d'authentification dans les en-têtes de la requête
      'Content-Type': 'application/json',
    });

    return this.http
      .post(`${this.apiUrl}/messages`, { message, receiver_id: receiverId }, { headers })
      .pipe(
        catchError((error) => {
          console.error('Erreur lors de l\'envoi du message', error);
          throw error;
        })
      );
  }

  // Fonction pour récupérer les messages d'un utilisateur
  getMessages(receiverId: number): Observable<any> {
    const userToken = localStorage.getItem('auth_token');  // Récupère le token d'authentification de l'utilisateur.

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${userToken}`, // Ajoute le token d'authentification dans les en-têtes de la requête
      'Content-Type': 'application/json',
    });

    return this.http
      .get(`${this.apiUrl}/messages/${receiverId}`, { headers })
      .pipe(
        catchError((error) => {
          console.error('Erreur lors de la récupération des messages', error);
          throw error;
        })
      );
  }



  /* task service */
  // Méthode pour récupérer les tâches
  getTaches(userId?: number): Observable<Tache[]> {
    let params = new HttpParams();
    if (userId) {
      params = params.set('user_id', userId.toString());
    }
    return this.http.get<Tache[]>(`${this.apiUrl}/taches`, { params });
  }

  // Méthode pour créer une tâche
  createTache(tache: Tache): Observable<Tache> {
    return this.http.post<Tache>(`${this.apiUrl}/taches`, tache);
  }

  // Méthode pour mettre à jour une tâche
  updateTache(id: number, tache: Partial<Tache>): Observable<Tache> {
    console.log('Données envoyées pour la mise à jour:', tache); // Vérification des données envoyées
    return this.http.put<Tache>(`${this.apiUrl}/taches/${id}`, tache);
  }
  

}
