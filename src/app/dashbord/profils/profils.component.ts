import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit,Output  } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from '../../services/api.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ngxCsv } from 'ngx-csv';
@Component({
  selector: 'app-profils',
  standalone: false,
  
  templateUrl: './profils.component.html',
  styleUrl: './profils.component.css'
})
export class ProfilsComponent {
  loading: boolean = true; // Indicateur de chargement
  allUsers: any[] = [];
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
    GetUsers() {
      this.apiService.GetUsers().subscribe((data) => {
        this.allUsers = data.users.map(user => ({
          ...user,
          total_time_seconds: parseInt(sessionStorage.getItem('totalTime') || '0', 10),
          historyKeys: this.getHistoryKeys(user.history)
        }));
        this.filteredUsers = [...this.allUsers];  // Initialiser filteredUsers avec tous les utilisateurs
        this.loading = false;
      }, error => {
        this.toastr.error('Erreur lors de la récupération des utilisateurs.');
      });
    }
  
    onSearch(event: any): void {
      // Récupérer la valeur de la recherche
      const query = event.target.value;
      this.searchQuery = query ? query.toLowerCase() : '';  // Appliquer toLowerCase() uniquement si la valeur est non vide
  
      // Si la recherche est vide, réinitialisez filteredUsers à tous les utilisateurs
      if (this.searchQuery === '') {
        this.filteredUsers = this.allUsers;
      } else {
        // Filtrer les utilisateurs par nom ou email
        this.filteredUsers = this.allUsers.filter(user => {
          const fullName = (user.name && typeof user.name === 'string' ? user.name.toLowerCase() : '') || '';
          const email = (user.email && typeof user.email === 'string' ? user.email.toLowerCase() : '') || '';
          return (
            fullName.includes(this.searchQuery) ||
            email.includes(this.searchQuery)
          );
        });
      }
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

 selectedUserpointage :any ;
  // 🔴 **NOUVEAU : Gestion du Pointage**
// Quand l'utilisateur clique pour modifier un pointage
openPopupEdit(user: any) {
  this.displayStylePointage = "block"; 
  this.selectedUser = user;
  console.log(this.selectedUser)
  this.pointageForm.patchValue({
    date: this.selectedUserpointage.date,
    heure_arrivee: this.selectedUser.arrival_date,
    heure_depart: this.selectedUser.last_departure,
    week : this.selectedUser.week
  });

  this.cdr.detectChanges(); // Force la mise à jour d'Angular
}

  itemdate(user: any){
    this.selectedUserpointage =   user.history
    console.log(" this.selectedUserpointage:",  this.selectedUserpointage); // Vérification des données
  }
  closePopupEdit() {
    this.displayStylePointage = "none"; 
  }
  submitPointage() {
    if (this.pointageForm.valid) {
        const formData = this.pointageForm.value;
        const userId = this.selectedUser.id;

        // Vérification du calcul du compteur (en secondes)
        const arrival = formData.heure_arrivee ? new Date('1970-01-01 ' + formData.heure_arrivee).getTime() : 0;
        const departure = formData.heure_depart ? new Date('1970-01-01 ' + formData.heure_depart).getTime() : 0;
        const counter = departure - arrival;

        // Envoi des données à l'API pour la mise à jour du pointage
        const updatedPointage = {
            date: formData.date,
            heure_arrivee: formData.heure_arrivee,
            heure_depart: formData.heure_depart,
            total_time_seconds: counter
        };

        // Appel API
        this.apiService.updatePointage(userId, updatedPointage).subscribe(
            response => {
                this.toastr.success('Pointage mis à jour avec succès !');
                console.log(response);
                this.closePopupEdit();
                this.refreshList();  // Met à jour la liste des utilisateurs après la modification
            },
            error => {
                this.toastr.error('Erreur lors de la mise à jour du pointage.');
                console.error(error);
            }
        );
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

downloadCsvFile(user: any) { 
  const csvdata = user.history;
  console.log("csvdatacsvdatacsvdata", csvdata);

  // Vérifier que l'historique existe
  if (!csvdata || csvdata.length === 0) {
    this.toastr.error('Aucun pointage disponible pour cet utilisateur.');
    return;
  }

  // Préparation des données pour l'exportation CSV
  const document :any =[];

  // Itérer sur chaque semaine dans l'historique
  csvdata.forEach((semaine: any) => {
    // Vérifier que la semaine contient des jours
    if (semaine.jours && semaine.jours.length > 0) {
      // Itérer sur chaque jour de la semaine
      semaine.jours.forEach((jour: any) => {
        document.push({
          Id: user.id || '',
          Jour: jour.day || '',
          Date: jour.date || '',
          Heure_Arrivee: jour.arrival_date || 'Pas de  pointage',
          Heure_Depart: jour.last_departure || 'Pas de  pointage',
          Total_Heures: jour.total_hours || '00:00:00',
          Localisation: jour.location || 'Non renseigné',  // Utilisation de "jour.location"
          Statut: jour.statut || "Hors ligne"  // Utilisation de "jour.statut"
        });
      });
    }
  });

  // Vérification du contenu du tableau avant de tenter de le générer
  console.log("Données pour CSV:", document);

  // Options de génération CSV
  const options = {  
    fieldSeparator: ';',  
    quoteStrings: '"',  
    decimalseparator: '.', 
    showLabels: true,  
    showTitle: false, 
    useBom: true, 
    noDownload: false, 
    headers: ["Id", "Jour", "Date", "Heure Arrivée", "Heure Départ", "Total Heures", "Localisation", "Statut"]
  }; 

  // Générer et télécharger le fichier CSV
  new ngxCsv(document, `Pointage_${user.name}`, options);  
}


downloadReport() {
  this.apiService.downloadMonthlyReport().subscribe(blob => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'rapport_mensuel_utilisateurs.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  });
}

downloadReportForMonth(event: Event) {
  const input = event.target as HTMLInputElement;
  const selectedMonth = input.value; // Ex: '2025-04'
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

  






}
