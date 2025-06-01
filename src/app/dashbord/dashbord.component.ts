import { Component, OnInit } from '@angular/core';
import { ApiService, PaginatedUsers } from '../services/api.service';
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
  loading: boolean = true; // Indicateur de chargement

  currentTime: string = '';
  user: any;
  filteredUsers: any[] = [];  // Cette liste contiendra les utilisateurs filtrés
  currentPage: number = 1;
    lastPage: number = 1;
    perPage: number = 4;
    total: number = 0;
  userId: number = 0;
  allUsers: any[] = [];
  location: string = '';
  arrivalDate: string = '';
  departureDate: string = '';
  totalTime: number = 0;  // Temps total en secondes
  interval: any;  // Intervalle pour le compteur
  counter: string = '00:00:00';  // Compteur initialisé à 00:00:00
usernotpagination :any
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
    
    if (this.user.status === 401) {
      this.router.navigate(['/']);
    }
    this.GetUserSByid()
    this.updateCurrentTime();
    this.GetUsers();
    this.allUsers.forEach(user => {
      user.historyKeys = this.getHistoryKeys(user.history);
    });
    if (this.user && this.user.id) {
      // Appel de l'API pour récupérer les congés pour l'utilisateur
      this.apiService.getLeavesForUser(this.user.id).subscribe((data: any) => {
        this.leavesuser = data;  // Sauvegarde les congés récupérés dans leavesuser
      });
    }
    this.apiService.getUsersnotpagination().subscribe(data => {
      this.usernotpagination = data.users;
    });
  }
  leavesuser: any[] = [];  // Liste des congés
showProfileSubmenu: boolean = false;

toggleProfileSubmenu() {
  this.showProfileSubmenu = !this.showProfileSubmenu;
}

  GetUserSByid() {
    this.apiService.GetUserServiceByid(this.user.id).subscribe({
      next: (data) => {
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

  getHistoryKeys(history: any): string[] {
    if (!history || typeof history !== 'object') {
      return [];
    }
    return Object.keys(history);
  }
  GetAllusers : any
  GetUsers(page: number = 1) {
    this.apiService.GetUsers(page).subscribe((data) => {
   this.GetAllusers  =  data
      // Vérification de la présence des utilisateurs avant de les traiter
      if (data?.users && Array.isArray(data.users)) {
        this.allUsers = data.users.map(user => ({
          ...user,
          total_time_seconds: parseInt(sessionStorage.getItem('totalTime') || '0', 10),
          historyKeys: this.getHistoryKeys(user.history)
        }));
  
        // Initialiser filteredUsers avec les utilisateurs traités
        this.filteredUsers = [...this.allUsers];
  
      } else {
        console.warn('Aucun utilisateur trouvé dans la réponse de l\'API.');
        this.filteredUsers = [];  // Si aucun utilisateur trouvé, initialise filteredUsers comme un tableau vide
      }
  
      // Mise à jour des autres données de pagination
      this.currentPage = data.current_page;
      this.lastPage = data.last_page;
      this.total = data.total;
      this.loading = false;
  
    }, error => {
      console.log('Error:', error);  // Affiche l'erreur dans la console
      this.toastr.error('Erreur lors de la récupération des utilisateurs.');
      this.loading = false;
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
