import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user-service.service';
import * as faceapi from 'face-api.js';
import introJs from 'intro.js';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone : false
})
export class HomeComponent implements OnInit {
intro = introJs();
  DataMessage: any[] = [];
  login = { email: '', password: '' };

  displayStyleF: string = "none"; // Contrôle l'affichage du modal
  passwordFieldType: string = 'password';


  constructor(
    private userservice: UserService,
    private authservice :AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {}
  // ngAfterViewInit() {
  //   this.startCamera();
  // }
  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (token) {
      this.router.navigate(['/dashboard']);
    }
  this.startTour()
  }
 startTour() {
    const intro = introJs(); // ✅ Crée l'instance

    intro.setOptions({
      steps: [
        { intro: 'Bienvenue dans notre app !' },
        { element: '#step1', intro: 'Connecter avec login et  possword .' },
        { element: '#step2', intro: 'Oublier  mot de pass   par envoyer un mail .' }
      ]
    });

    intro.start();
  }
  
  
  
  togglePasswordVisibility() {
    this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
  }
 
  openPopupForgeten() { 
    this.displayStyleF = "block"; 
  }
  
  closePopupForgeten() { 
    this.displayStyleF = "none"; 
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