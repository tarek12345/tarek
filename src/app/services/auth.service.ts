import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public apiUrl = 'http://127.0.0.1:8000/api'; // URL de l'API

  constructor(private http: HttpClient) {}

  /**
   * Vérifie si le token JWT est expiré.
   * @param token Le token JWT à vérifier.
   * @returns `true` si le token est expiré, sinon `false`.
   */
  isTokenExpired(token: string): boolean {
    if (!token) return true; // Si le token est absent, il est considéré comme expiré

    try {
      const payload = JSON.parse(atob(token.split('.')[1])); // Décoder le payload du token
      const expirationDate = new Date(payload.exp * 1000); // Convertir la date d'expiration en millisecondes
      return expirationDate < new Date(); // Vérifier si la date d'expiration est passée
    } catch (error) {
      console.error('Erreur lors de la vérification du token :', error);
      return true; // En cas d'erreur, considérer le token comme expiré
    }
  }

  /**
   * Méthode pour se connecter.
   * @param email L'email de l'utilisateur.
   * @param password Le mot de passe de l'utilisateur.
   * @returns Un Observable avec la réponse du serveur.
   */
  login(email: string, password: string): Observable<any> {
    const body = { email, password };
    return this.http.post(`${this.apiUrl}/login`, body);
  }

  /**
   * Méthode pour se déconnecter.
   * @returns Un Observable avec la réponse du serveur.
   */
  logout(): Observable<any> {
    const token = localStorage.getItem('token'); // Récupérer le token du localStorage
    if (!token) {
      throw new Error('Aucun token trouvé.'); // Gérer le cas où le token est absent
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(`${this.apiUrl}/logout`, {}, { headers });
  }

  /**
   * Méthode pour demander la réinitialisation du mot de passe.
   * @param email L'email de l'utilisateur.
   * @returns Un Observable avec la réponse du serveur.
   */
  forgotPassword(email: string): Observable<any> {
    const body = { email };
    return this.http.post(`${this.apiUrl}/forgot-password`, body, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * Méthode pour réinitialiser le mot de passe.
   * @param data Les données nécessaires pour la réinitialisation (token, email, nouveau mot de passe, etc.).
   * @returns Un Observable avec la réponse du serveur.
   */
  resetPassword(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/reset-password`, data);
  }
}