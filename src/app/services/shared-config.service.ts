import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root' // 🔹 rend le service disponible partout sans l'ajouter dans un module
})
export class SharedConfigService {
  private refreshSubject = new BehaviorSubject<boolean>(false);
  refresh$ = this.refreshSubject.asObservable();

  // 🔹 Méthode pour déclencher le refresh
  triggerRefresh() {
    this.refreshSubject.next(true);
  }
}
