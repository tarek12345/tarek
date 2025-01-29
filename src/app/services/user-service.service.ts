import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private secretKey = '02196b3c78bbfb9b5f2e4f8a43c50e0fc063cc687872d6ce5f5c2637e13415c9'; // Utilisez une clé secrète forte
  private userInfo: any = null;

  constructor() { 
    // Vérifier si l'utilisateur est déjà dans localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      this.userInfo = this.decrypt(userData); // Décrypter les données
    }
  }

  // Fonction pour crypter les données
  private encrypt(data: any): string {
    return CryptoJS.AES.encrypt(JSON.stringify(data), this.secretKey).toString();
  }

  // Fonction pour décrypter les données
  private decrypt(data: string): any {
    const bytes = CryptoJS.AES.decrypt(data, this.secretKey);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  }

  // Enregistrer les informations cryptées dans localStorage
  setEncryptedItem(key: string, data: any) {
    const encryptedData = this.encrypt(data);
    localStorage.setItem(key, encryptedData);
  }

  // Obtenir les informations cryptées depuis localStorage et les décrypter
  getDecryptedItem(key: string): any {
    const encryptedData = localStorage.getItem(key);
    return encryptedData ? this.decrypt(encryptedData) : null;
  }

  // Enregistrer les informations utilisateur (cryptées)
  setUserInfo(userData: any) {
    this.userInfo = userData;
    const encryptedData = this.encrypt(userData); // Crypter les données avant de les enregistrer
    localStorage.setItem('user', encryptedData);
  }

  // Obtenir les informations utilisateur (données décrytées)
  getUserInfo() {
    return this.userInfo;
  }

  setToken(token: string): void {
    const encryptedToken = this.encrypt(token); // Crypter le token
    localStorage.setItem('token', encryptedToken);
  }

  getToken(): string | null {
    const encryptedToken = localStorage.getItem('token');
    return encryptedToken ? this.decrypt(encryptedToken) : null; // Décrypter le token avant de le retourner
  }

  // Effacer les informations utilisateur et supprimer du localStorage
  clearUserInfo() {
    this.userInfo = null;
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('arrivalDate');
    localStorage.removeItem('departureDate');
    localStorage.removeItem('location');
    localStorage.removeItem('totalTime');
    localStorage.removeItem('status');
  }
}
