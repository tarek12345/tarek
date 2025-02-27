import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-profils',
  standalone: false,
  
  templateUrl: './profils.component.html',
  styleUrl: './profils.component.css'
})
export class ProfilsComponent {
  loading: boolean = true; // Indicateur de chargement
  allUsers: any[] = [];
  Historyitem: any[] = [];
  @Input() userdetaile :any
  displayStyle: string = "none"; // Contrôle l'affichage du modal
  ngOnInit(): void {
 this.GetUsers()
  
  }
  
    constructor(
      private apiService: ApiService,
      private toastr: ToastrService,
      private router: Router
    ) {}
  GetUsers() {
    this.apiService.GetUsers().subscribe((data) => {
      this.allUsers = data.users.map(user => ({
        ...user,
        total_time_seconds: parseInt(sessionStorage.getItem('totalTime') || '0', 10)
      }));
      
      this.loading = false;
    }, error => {
      this.toastr.error('Erreur lors de la récupération des utilisateurs.');
    });
  }
  getHistoryKeys(history: any): string[] {
    return history ? Object.keys(history) : [];
  }
  

  openPopup() { 
    this.displayStyle = "block"; 

  }
  closePopup() { 
    this.displayStyle = "none"; 
  }
}
