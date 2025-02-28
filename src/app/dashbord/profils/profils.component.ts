import { Component, EventEmitter, Input, OnInit,Output  } from '@angular/core';
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
  selectedUser :any =[]
  @Input() userdetaile :any
  @Output() employeeAdded = new EventEmitter<void>();
  displayStyle: string = "none"; // Contrôle l'affichage du modal
  displayStyleDelete: string = "none"; // Contrôle l'affichage du modal
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
  confirmDeleteUser(user: any) {
    if (confirm(`Êtes-vous sûr de vouloir supprimer ${user.name} ?`)) {
      this.DeleteUser(user);
    }
  }
  
  DeleteUser(user: any) {
    this.apiService.DeleteService(user.id).subscribe(
      response => {
        console.log('Utilisateur supprimé avec succès', response);
        // Supprime l'utilisateur de la liste affichée
        this.allUsers = this.allUsers.filter(u => u.id !== user.id);
        this.closePopupDelete()
      },
      error => {
        console.error('Erreur lors de la suppression de l\'utilisateur', error);
      }
    );
  }
  openPopupDelete(user: any) { 
    this.displayStyleDelete = "block"; 
    this.selectedUser = user
  }
  closePopupDelete() { 
    this.displayStyleDelete = "none"; 
  }
  openPopup() { 
    this.displayStyle = "block"; 

  }
  closePopup() { 
    this.displayStyle = "none"; 
  }
  refreshList() {
    this.GetUsers(); // Recharge les employés
  }
}
