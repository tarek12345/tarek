import { Component, Input, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-statistique',
  standalone: false,
  templateUrl: './statistique.component.html',
  styleUrls: ['./statistique.component.css']
})
export class StatistiqueComponent implements OnInit {

  @Input() userdetaile: any;

  allUsers: any[] = [];
  filteredUsers: any[] = [];

  searchQuery: string = '';

  statusCounts: any = null;

  currentPage: number = 1;
  lastPage: number = 1;
  perPage: number = 4;
  total: number = 0;

  loading: boolean = true;

  constructor(
    private apiService: ApiService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.GetUsers();
  }

  /**
   * Récupérer les utilisateurs
   */
  GetUsers(page: number = 1): void {

    this.loading = true;

    this.apiService.GetUsers(page).subscribe({
      next: (data: any) => {

        console.log('Users reçus :', data);

        if (data?.users && Array.isArray(data.users)) {

          this.allUsers = data.users.map((user: any) => ({
            ...user,

            total_time_seconds: parseInt(
              sessionStorage.getItem('totalTime') || '0',
              10
            ),

            historyKeys: this.getHistoryKeys(user.history)
          }));

          // Initialiser les utilisateurs affichés
          this.filteredUsers = [...this.allUsers];

        } else {

          this.allUsers = [];
          this.filteredUsers = [];

          console.warn(
            'Aucun utilisateur trouvé dans la réponse de l API.'
          );
        }

        // Pagination
        this.currentPage = data?.current_page || 1;
        this.lastPage = data?.last_page || 1;
        this.total = data?.total || 0;

        this.loading = false;
      },

      error: (error) => {

        console.error(
          'Erreur récupération utilisateurs :',
          error
        );

        this.toastr.error(
          'Erreur lors de la récupération des utilisateurs.'
        );

        this.loading = false;
      }
    });
  }

  /**
   * Récupérer les clés de history
   */
  getHistoryKeys(history: any): string[] {

    if (!history || typeof history !== 'object') {
      return [];
    }

    return Object.keys(history);
  }

  /**
   * Pagination
   */
  onPageChange(page: number): void {

    if (
      page >= 1 &&
      page <= this.lastPage &&
      page !== this.currentPage
    ) {

      this.GetUsers(page);
    }
  }

  /**
   * Recherche utilisateur
   */
  onSearch(event: any): void {

    const query = event?.target?.value || '';

    this.searchQuery = query.trim();

    // Si recherche vide
    if (!this.searchQuery) {

      this.GetUsers(1);

      return;
    }

    this.loading = true;

    this.apiService
      .searchUsers(
        this.searchQuery,
        this.perPage,
        1
      )
      .subscribe({

        next: (response: any) => {

          console.log(
            'Résultat recherche :',
            response
          );

          this.filteredUsers =
            response?.users || [];

          this.currentPage =
            response?.current_page || 1;

          this.lastPage =
            response?.last_page || 1;

          this.total =
            response?.total || 0;

          this.statusCounts =
            response?.status_counts || null;

          this.loading = false;
        },

        error: (error) => {

          console.error(
            'Erreur recherche :',
            error
          );

          this.filteredUsers = [];

          this.loading = false;

          this.toastr.error(
            'Erreur lors de la recherche.'
          );
        }
      });
  }

  /**
   * Vérifier si l'utilisateur possède des statistiques
   */
  hasHistory(user: any): boolean {

    if (!user?.history) {
      return false;
    }

    if (Array.isArray(user.history)) {
      return user.history.length > 0;
    }

    if (typeof user.history === 'object') {
      return Object.keys(user.history).length > 0;
    }

    return false;
  }

  /**
   * ID unique pour les tabs Bootstrap
   */
  getTabId(user: any, type: string): string {

    return `user-${user?.id}-${type}`;
  }
  trackByUserId(index: number, user: any): any {
  return user?.id ?? index;
}
}