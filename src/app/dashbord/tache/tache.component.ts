import { Component, Input, SimpleChanges, OnInit } from '@angular/core';
import { ApiService, Tache, Statut } from '../../services/api.service';
import { UserService } from '../../services/user-service.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-tache',
  templateUrl: './tache.component.html',
  styleUrls: ['./tache.component.css'],
  standalone: false
})
export class TacheComponent implements OnInit {
  @Input() userdetaile: any;
  displayStyle: string = "none";
  displayStyleTache: string = "none";

  selectedUser: any = null;
  selectedTache: any = null;
  allusers: any[] = [];

  newTask: Tache = {
    titre: '',
    description: '',
    statut: 'todo',
    user_id: 1,
    ordre: 0
  };

  tachesByStatus: { [key in Statut]: Tache[] } = {
    todo: [],
    in_progress: [],
    done: []
  };

  constructor(
    private apiService: ApiService,
    private userService: UserService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['userdetaile']) {
      this.allusers = changes['userdetaile']?.currentValue;
    }
  }

  ngOnInit(): void {
    this.loadTaches();
  }

  loadTaches(): void {
    this.apiService.getTaches().subscribe(taches => {
      this.tachesByStatus = {
        todo: taches.filter(t => t.statut === 'todo'),
        in_progress: taches.filter(t => t.statut === 'in_progress'),
        done: taches.filter(t => t.statut === 'done'),
      };
    });
  }
  statutKeys: Statut[] = ['todo', 'in_progress', 'done'];

  drop(event: CdkDragDrop<Tache[]>, newStatut: Statut): void {
    const prevStatut = event.previousContainer.id as Statut;
    const tache: Tache = event.item.data;

    if (!tache || !tache.id) {
      this.toastr.error("Tâche invalide");
      return;
    }

    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      tache.ordre = event.currentIndex;
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );

      tache.statut = newStatut;
      tache.ordre = event.currentIndex;

      this.apiService.updateTache(tache.id, {
        statut: newStatut,
        ordre: tache.ordre
      }).subscribe(
        (updatedTache) => {
          this.toastr.success("Tâche déplacée");
        },
        (error) => {
          this.toastr.error("Erreur lors de la mise à jour de la tâche");
          console.error("Erreur", error);
        }
      );
    }
  }

  get visibleUsers() {
    return this.allusers ? (this.showAllUsers ? this.allusers : this.allusers.slice(0, 5)) : [];
  }

  get hiddenUserCount() {
    return this.allusers && this.allusers.length > 5 ? this.allusers.length - 5 : 0;
  }

  showAllUsers: boolean = false;

  toggleShowAllUsers(): void {
    this.showAllUsers = true;
  }

  openPopup(user: any): void {
    this.selectedUser = user || null;
    this.displayStyle = "block";
  }

  selectUser(user: any): void {
    this.selectedUser = user;
    this.displayStyle = "block";
  }

  selectTache(tache: any): void {
    this.selectedTache = tache;
    this.displayStyleTache = "block";
  }

  closePopup(): void {
    this.displayStyle = "none";
  }

  closePopupTache(): void {
    this.displayStyleTache = "none";
  }

  addTask(): void {
    if (!this.newTask.titre || !this.newTask.description) {
      this.toastr.error('Le titre et la description sont obligatoires');
      return;
    }

    if (this.selectedUser) {
      this.newTask.user_id = this.selectedUser.id;
    } else {
      this.toastr.error('Aucun utilisateur sélectionné');
      return;
    }

    this.apiService.createTache(this.newTask).subscribe(
      (newTache) => {
        this.tachesByStatus['todo'].push(newTache);
        this.toastr.success('Tâche ajoutée avec succès');
        this.newTask = { titre: '', description: '', statut: 'todo', user_id: 0, ordre: 0 };
        this.closePopup();
      },
      (error) => {
        this.toastr.error('Erreur lors de la création de la tâche');
      }
    );
  }

  reset(): void {
    this.newTask = { titre: '', description: '', statut: 'todo', user_id: 0, ordre: 0 };
    this.closePopup();
  }
  onDeleteTache(id: number | undefined) {
    if (id === undefined) {
      console.error('ID de la tâche est indéfini.');
      return;
    }
  
    if (confirm('Voulez-vous vraiment supprimer cette tâche ?')) {
      this.apiService.deleteTache(id).subscribe({
        next: (res) => {
          console.log('Tâche supprimée avec succès', res);
          this.toastr.success('Tâche supprimée avec succès');
          this.loadTaches()
          // Mettre à jour la liste des tâches ici
        },
        error: (err) => {
          this.toastr.error('Erreur lors de supprimée  Tâche',err);        }
      });
    }
  }
updateTacheInfo(): void {
  if (!this.selectedTache || !this.selectedTache.id) {
    this.toastr.error("Aucune tâche sélectionnée");
    return;
  }

  const data = {
    titre: this.selectedTache.titre,
    description: this.selectedTache.description
  };

  this.apiService.updateTacheInfo(this.selectedTache.id, data).subscribe({
    next: (res) => {
      this.toastr.success("Tâche mise à jour");
      this.closePopupTache();
      this.loadTaches();
    },
    error: (err) => {
      this.toastr.error("Erreur lors de la mise à jour", err.message);
    }
  });
}


}
