import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user-service.service';
import { AddEmployesComponent } from "./add-employes/add-employes.component";
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone : false
})
export class HomeComponent implements OnInit {
  DataMessage: any[] = [];
  login = { email: '', password: '' };
  displayStyle: string = "none"; // Contrôle l'affichage du modal
  displayStyleF: string = "none"; // Contrôle l'affichage du modal
  passwordFieldType: string = 'password';


  constructor(
    private userservice: UserService,
    private authservice :AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (token) {
      // Rediriger vers le dashboard si l'utilisateur est déjà connecté
      this.router.navigate(['/dashboard']);
    }
  
  }
  togglePasswordVisibility() {
    this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
  }
  openPopup() { 
    this.displayStyle = "block"; 
  }
  openPopupForgeten() { 
    this.displayStyleF = "block"; 
  }
  
  closePopupForgeten() { 
    this.displayStyleF = "none"; 
  }

  closePopup() { 
    this.displayStyle = "none"; 
  }



  reset() {
    this.DataMessage = [];
  }

  
  SignIn() {
    this.authservice.login(this.login.email, this.login.password).subscribe(
      (response: any) => {
        // Succès : L'utilisateur est authentifié
        this.toastr.success('Connexion réussie', 'Succès');
  
        // Sauvegarder le token dans le stockage local
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user)); // Sauvegarder l'utilisateur
  
        // Enregistrer les informations de l'utilisateur dans le service
        this.userservice.setUserInfo(response.user);
  
        // Rediriger vers le dashboard
        this.router.navigate(['/dashboard']);
      },
      (error) => {
        // Erreur : Identifiants incorrects
        this.toastr.error('Nom ou mot de passe incorrect.', 'Erreur');
      }
    );
  }
  
}