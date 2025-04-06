import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { UserService } from '../services/user-service.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router'; // Pour la redirection

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashbord.component.html',
  styleUrls: ['./dashbord.component.css'],
  standalone : false
})
export class DashbordComponent implements OnInit {
  currentTime: string = '';
  user: any;
  userId: number = 0;
  allUsers: any
  location: string = '';
  arrivalDate: string = '';
  departureDate: string = '';
  totalTime: number = 0;  // Temps total en secondes
  interval: any;  // Intervalle pour le compteur
  counter: string = '00:00:00';  // Compteur initialisé à 00:00:00

  constructor(
    private apiService: ApiService,
    private userService: UserService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
  
    this.user = this.userService.getUserInfo();
   
    if (this.user) {
      this.userId = this.user.id;
    }
    const token = localStorage.getItem('token');
    console.log("this.user",token);
    
    if (this.user.status === 401) {
      this.router.navigate(['/']);
    }
    this.GetUserSByid()
    this.updateCurrentTime();
   this.GetUsers
  }
  GetUserSByid() {
    this.apiService.GetUserServiceByid(this.user.id).subscribe({
      next: (data) => {
        console.log("ssssssssss", data);
        this.user = data;
      },
      error: (error) => {
        console.error("Erreur lors de la récupération des infos utilisateur :", error);
        if (error.status === 401) {
          this.logout();  // méthode de déconnexion
          this.router.navigate(['/']); // redirection
        }
      }
    });
  }
  GetUsers() {
    this.apiService.GetUsers().subscribe((data) => {
      this.allUsers = data.users.map(user => ({
        ...user,
        total_time_seconds: parseInt(sessionStorage.getItem('totalTime') || '0', 10)
      }));
    }, error => {
      this.toastr.error('Erreur lors de la récupération des utilisateurs.');
    });
  }
  updateCurrentTime(): void {
    setInterval(() => {
      this.currentTime = new Date().toLocaleTimeString();
    }, 1000);
  }


  logout() {
    this.userService.clearUserInfo();
    this.toastr.success('Déconnexion réussie', 'Succès');
    this.router.navigate(['/']);
  }
}
