import { ChangeDetectorRef, Component, Input, SimpleChanges } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-statistique',
  standalone: false,
  
  templateUrl: './statistique.component.html',
  styleUrl: './statistique.component.css'
})
export class StatistiqueComponent {
  @Input() userdetaile :any
  allUsers: any[] = [];
  filteredUsers: any[] = [];  // Cette liste contiendra les utilisateurs filtrés
  searchQuery: string = '';  // La variable pour stocker la requête de recherche
  statusCounts :any
  currentPage: number = 1;
  lastPage: number = 1;
  perPage: number = 4;
  total: number = 0;
  loading: boolean = true; // Indicateur de chargement

      // Déclaration du graphique
    constructor(
      private apiService: ApiService,
      private toastr: ToastrService,
      private router: Router,
      private fb: FormBuilder,
      private cdr: ChangeDetectorRef // Ajout
    ) {  // Initialisation du formulaire de pointage

      this.filteredUsers = [];  // Initialisation de la liste des utilisateurs filtrés

    }

    ngOnInit(): void {
      this.GetUsers();
      this.allUsers.forEach(user => {
        user.historyKeys = this.getHistoryKeys(user.history);
      });
    }   
      GetUsers(page: number = 1) {
        this.apiService.GetUsers(page).subscribe((data) => {
      
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
      getHistoryKeys(history: any): string[] {
        if (!history || typeof history !== 'object') {
          return [];
        }
        return Object.keys(history);
      }
      
      onPageChange(page: number): void {
        if (page >= 1 && page <= this.lastPage) {
          this.GetUsers(page);
          
        }
      }
  onSearch(event: any): void {
    const query = event.target.value;
    this.searchQuery = query;
  
    this.apiService.searchUsers(this.searchQuery, this.perPage, 1).subscribe(response => {
      this.filteredUsers = response.users;
      this.currentPage = response.current_page;
      this.lastPage = response.last_page;
      this.statusCounts = response.status_counts;
    });
  }
}
