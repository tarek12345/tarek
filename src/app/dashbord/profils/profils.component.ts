import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit,Output  } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from '../../services/api.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ngxCsv } from 'ngx-csv';
interface Pointage {
  id: number;
  arrival_date: string;    // heure d'arrivée (ex: "08:00:25")
  last_departure: string;  // heure de départ (ex: "2025-05-20 15:54:31")
  location: string;        // lieu (ex: "Avenue Charles Nicole, Tunis, Tunisie")
  user_id: number;
  // Tu peux ajouter d'autres propriétés ici si besoin
}

interface Day {
  id: number;
  date: string;            // ex: "2025-05-20"
  day: string;             // ex: "Mardi"
  month: string;           // ex: "Mai"
  week: number;            // ex: 3 (semaine dans le mois)
  arrival_date: string;    // ex: "08:00:25"
  last_departure: string;  // ex: "15:54:31"
  location: string;        // ex: "Avenue Charles Nicole, Tunis, Tunisie"
  status: string;          // ex: "hors ligne"
  total_hours: string;     // ex: "07:54:06"
  counter: number;         // ex: 28446 (seconds)
  pointages: Pointage[];   // tableau des pointages associés à ce jour
}

@Component({
  selector: 'app-profils',
  standalone: false,
  templateUrl: './profils.component.html',
  styleUrl: './profils.component.css'
})
export class ProfilsComponent {
    loading: boolean = true; // Indicateur de chargement
    allUsers: any[] = [];
    currentPage: number = 1;
    lastPage: number = 1;
    perPage: number = 4;
    total: number = 0;
  filteredUsers: any[] = [];  // Cette liste contiendra les utilisateurs filtrés
  searchQuery: string = '';  // La variable pour stocker la requête de recherche
  Historyitem: any[] = [];
  selectedUser :any =[]
  pointageForm: FormGroup;
  @Input() userdetaile :any
  @Output() employeeAdded = new EventEmitter<void>();
  displayStyle: string = "none"; // Contrôle l'affichage du modal
  displayStyleDelete: string = "none"; // Contrôle l'affichage du modal
  displayStylePointage: string = "none";
   selectedUserpointage: any;
   
  ngOnInit(): void {
    this.GetUsers();
    this.allUsers.forEach(user => {
      user.historyKeys = this.getHistoryKeys(user.history);
    });
  }
  
    constructor(
      private apiService: ApiService,
      private toastr: ToastrService,
      private router: Router,
      private fb: FormBuilder,
      private cdr: ChangeDetectorRef // Ajout
    ) {  // Initialisation du formulaire de pointage
      this.pointageForm = this.fb.group({
        date: ['', Validators.required],
        heure_arrivee: [''],
        heure_depart: [''],
      });
      this.filteredUsers = [];  // Initialisation de la liste des utilisateurs filtrés

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
    
    
    onPageChange(page: number): void {
      if (page >= 1 && page <= this.lastPage) {
        this.GetUsers(page);
      }
    }

    statusCounts :any
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
    
  getHistoryKeys(history: any): string[] {
    if (!history || typeof history !== 'object') {
      return [];
    }
    return Object.keys(history);
  }
  
  confirmDeleteUser(user: any) {
    if (confirm(`Êtes-vous sûr de vouloir supprimer ${user.name} ?`)) {
      this.DeleteUser(user);
     
    }
  }
  trackByKey(index: number, key: string): string {
    return key;
  }
  DeleteUser(user: any) {
    this.apiService.DeleteService(user.id).subscribe(
      response => {
        console.log('Utilisateur supprimé avec succès', response);
        // Supprime l'utilisateur de la liste affichée
        this.allUsers = this.allUsers.filter(u => u.id !== user.id);
        this.closePopupDelete()
        this.refreshList();  // Met à jour la liste des utilisateurs après la modification

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


  // 🔴 **NOUVEAU : Gestion du Pointage**
// Quand l'utilisateur clique pour modifier un pointage
openPopupEdit(day: Day, user: any) {
    this.displayStylePointage = "block";
    this.selectedDay = day;
    this.selectedUserpointage = user.id; // fixed variable name
    console.log("selectedDay",this.selectedDay)
    console.log("selectedUserpointage",this.selectedUserpointage)

    this.pointageForm.patchValue({
      date: day.date,
      heure_arrivee: day.arrival_date,
      heure_depart: day.last_departure
    });
    this.cdr.detectChanges();
  }


  closePopupEdit() {
    this.displayStylePointage = "none"; 
  }
selectedDay?: Day; // ou selectedDay: Day | null = null;

submitPointage() {
  if (this.pointageForm.valid && this.selectedDay && this.selectedDay.pointages && this.selectedDay.pointages.length > 0) {
    const formData = this.pointageForm.value;
    const userId = this.selectedUserpointage; // id utilisateur

    // Récupérer l'id du pointage dans le premier élément du tableau pointages
    const pointageId = this.selectedDay.pointages[0].id;

    const arrival = formData.heure_arrivee ? new Date('1970-01-01T' + formData.heure_arrivee).getTime() : 0;
    const departure = formData.heure_depart ? new Date('1970-01-01T' + formData.heure_depart).getTime() : 0;
    const counter = departure - arrival;

    const updatedPointage = {
      date: formData.date,
      heure_arrivee: formData.heure_arrivee,
      heure_depart: formData.heure_depart,
      total_time_seconds: counter
    };

    this.apiService.updatePointage(userId, pointageId, updatedPointage).subscribe(
      response => {
        this.toastr.success('Pointage mis à jour avec succès !');
        this.refreshList();
        this.closePopupEdit();
      },
      error => {
        this.toastr.error('Erreur lors de la mise à jour du pointage.');
        console.error(error);
      }
    );
  } else {
    this.toastr.error('Formulaire invalide ou pointage non sélectionné.');
  }
}




// Fonction pour calculer le counter (total des heures en secondes)
calculateCounter(): number {
  const formValue = this.pointageForm.value;
  const heureArrivee = formValue.heure_arrivee ? new Date('1970-01-01 ' + formValue.heure_arrivee).getTime() : 0;
  const heureDepart = formValue.heure_depart ? new Date('1970-01-01 ' + formValue.heure_depart).getTime() : 0;

  // Calcul du total en secondes
  return heureDepart - heureArrivee;
}

downloadReport() {
  const currentMonth = new Date().toISOString().slice(0, 7); // ex: '2025-04'
  this.apiService.downloadMonthlyReport(currentMonth).subscribe(blob => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rapport_${currentMonth}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  });
}

downloadReportForMonth(event: Event) {
  const input = event.target as HTMLInputElement;
  const selectedMonth = input.value;

  if (selectedMonth) {
    this.apiService.downloadMonthlyReport(selectedMonth).subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `rapport_${selectedMonth}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }
}

downloadUserReport(userId: number, event: Event) {
  const input = event.target as HTMLInputElement;
  const selectedMonth = input.value;

  if (selectedMonth) {
    this.apiService.downloadUserMonthlyReport(userId, selectedMonth).subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `rapport_${userId}_${selectedMonth}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }
}


}


