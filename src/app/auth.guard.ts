import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit() {
    const token = localStorage.getItem('token');
    if (token && this.authService.isTokenExpired(token)) {
      localStorage.removeItem('token'); // Supprimer le token expiré
      this.router.navigate(['/']); // Rediriger vers la page de connexion
    }
  }

  // Méthode exécutée avant d'activer une route
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    // Récupérer le token depuis le localStorage
    const token = localStorage.getItem('token');

    if (token) {
    //  console.log('Utilisateur authentifié. Accès autorisé.');
     // console.log(token)
      return true; // L'utilisateur est authentifié, autorisation d'accès
    }
    else{
     // console.log(token)
    // Si le token n'existe pas ou est invalide
    console.log('Accès refusé. Redirection vers la page de connexion.');
    this.router.navigate(['/']); // Rediriger vers la page de connexion
    return false; // Bloquer l'accè
    }

  }
}
