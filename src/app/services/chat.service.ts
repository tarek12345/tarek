import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ChatService {
  public apiUrl = environment.apiUrl; // URL de l'API

  constructor(private http: HttpClient) {}

  getConversations(userId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/conversations/${userId}`);
  }

  getMessages(convId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/messages/${convId}`);
  }

  startConversation(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/start`, data);
  }

  sendMessage(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/send`, data);
  }
getUnreadMessages(userId: number) {
  return this.http.get<any>(`${this.apiUrl}/chat/unread/${userId}`);
}

markAsRead(convId: number, userId: number) {
  return this.http.post(`${this.apiUrl}/messages/mark-read/${convId}/${userId}`, {});
}


}
