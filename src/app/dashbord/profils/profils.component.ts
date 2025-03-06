import { Component, EventEmitter, Input, OnInit,Output  } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from '../../services/api.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  pointageForm: FormGroup;
  @Input() userdetaile :any
  @Output() employeeAdded = new EventEmitter<void>();
  displayStyle: string = "none"; // Contrôle l'affichage du modal
  displayStyleDelete: string = "none"; // Contrôle l'affichage du modal
  displayStylePointage: string = "none";
  ngOnInit(): void {
 this.GetUsers()
  
  }
  
    constructor(
      private apiService: ApiService,
      private toastr: ToastrService,
      private router: Router,
      private fb: FormBuilder
    ) {  // Initialisation du formulaire de pointage
      this.pointageForm = this.fb.group({
        date: ['', Validators.required],
        heure_arrivee: [''],
        heure_depart: [''],
      });}
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

 selectedUserpointage :any ;
  // 🔴 **NOUVEAU : Gestion du Pointage**
// Quand l'utilisateur clique pour modifier un pointage
openPopupEdit(user: any, key: string) {
  this.displayStylePointage = "block"; 
  this.selectedUser = user;
  this.selectedUserpointage = user.history[key];

  this.pointageForm.patchValue({
    date: this.selectedUserpointage.date,
    heure_arrivee: this.selectedUserpointage.arrival_date,
    heure_depart: this.selectedUserpointage.last_departure,
  });
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

}
