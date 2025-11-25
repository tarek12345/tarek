import { Component, Input, SimpleChanges, OnInit } from '@angular/core';
import { ApiService, Tache, Statut } from '../../services/api.service';
import { UserService } from '../../services/user-service.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import "quill/dist/quill.core.css";
@Component({
  selector: 'app-tache',
  templateUrl: './tache.component.html',
  styleUrls: ['./tache.component.css'],
  standalone: false
})
export class TacheComponent implements OnInit {
  @Input() userdetaile: any;
  @Input() datauser: any;
   selected: { startDate: moment.Moment, endDate: moment.Moment } | null = null;
  taches: Tache[] = []; // ✅ Déclaration correcte
  selectedshowTache: Tache | null = null; // ✅ Typage explicite
  newComment: { [taskId: number]: string } = {};
  userid :any
  displayStyle: string = "none";
  displayStyleTache: string = "none";
  ShowStyleTache: string = "none";
  selectedUser: any = null;
  selectedTache: any = null;
  allusers: any[] = [];

  newTask: Tache = {
    titre: '',
    description: '',
    end_date:'',
    start_date:'',
    statut: 'todo',
    user_id: 1,
    ordre: 0,

  };

  tachesByStatus: { [key in Statut]: Tache[] } = {
    todo: [],
    in_progress: [],
    test: [],
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
    else  {
      this.userid = changes['datauser']?.currentValue?.user
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
        test: taches.filter(t => t.statut === 'test'),
        done: taches.filter(t => t.statut === 'done'),
      };
    });
  }
  statutKeys: Statut[] = ['todo', 'in_progress', 'test' ,'done'];

  
drop(event: CdkDragDrop<Tache[]>, newStatut: Statut): void {
  const prevStatut = event.previousContainer.id as Statut;
  const tache: Tache = event.item.data;

  if (!tache || !tache.id) {
    this.toastr.error("Tâche invalide");
    return;
  }

  // Mappage des statuts vers leur "ordre de colonne"
  const statutOrdre: { [key in Statut]: number } = {
    todo: 0,
    in_progress: 1,
    test :2,
    done: 3
  };

  if (event.previousContainer === event.container) {
    // Drag dans la même colonne : on peut ignorer ou réordonner localement
    moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    // Facultatif : mise à jour si tu veux un ordre visuel dans la colonne
  } else {
    // Drag vers une autre colonne
    transferArrayItem(
      event.previousContainer.data,
      event.container.data,
      event.previousIndex,
      event.currentIndex
    );

    tache.statut = newStatut;
    tache.ordre = statutOrdre[newStatut]; // 👉 ordre basé sur la colonne

    console.log("➡️ Données envoyées:", {
      statut: tache.statut,
      ordre: tache.ordre
    });

    this.apiService.updateTache(tache.id, {
      statut: tache.statut,
      ordre: tache.ordre
    }).subscribe(
      (updated) => {
        this.toastr.success("Tâche déplacée");
      },
      (err) => {
        this.toastr.error("Erreur mise à jour tâche");
        console.error(err);
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



  openPopup(user: any): void {
    this.selectedUser = user || null;
    this.displayStyle = "block";
  }
  selectedusermodal :any
openPopupshow(task: any): void {
  this.selectedshowTache = task;
  this.selectedusermodal = this.visibleUsers.find(u => u.id === task.user_id) || null;
  this.ShowStyleTache = "block";
}

  selectUser(user: any): void {
    this.selectedUser = user;
    this.displayStyle = "block";
    this.closeHiddenUsersModal()
  }

  selectTache(tache: any): void {
    this.selectedTache = tache;
    this.selectedusermodal = this.visibleUsers.find(u => u.id === tache.user_id) || null;
   // console.log("first",this.selectedusermodal)
    this.displayStyleTache = "block";
  }

  closePopup(): void {
    this.displayStyle = "none";
  }

  closePopupTache(): void {
    this.displayStyleTache = "none";
  }
  closePopupshowTache(): void {
    this.ShowStyleTache = "none";
  }

  addTask(): void {
  if (!this.newTask.titre || !this.newTask.description) {
    this.toastr.error('Le titre et la description sont obligatoires');
    return;
  }

  if (!this.selectedUser) {
    this.toastr.error('Aucun utilisateur sélectionné');
    return;
  }

  if (!this.selected || !this.selected.startDate || !this.selected.endDate) {
    this.toastr.error('Veuillez sélectionner une période de date');
    return;
  }

  // Affectation des valeurs sûres
  this.newTask.user_id = this.selectedUser.id;
  this.newTask.start_date = this.selected.startDate.format('YYYY-MM-DD');
  this.newTask.end_date = this.selected.endDate.format('YYYY-MM-DD');

  this.apiService.createTache(this.newTask).subscribe(
    (newTache) => {
      this.tachesByStatus['todo'].push(newTache);
      this.toastr.success('Tâche ajoutée avec succès');
      this.newTask = { titre: '', description: '', statut: 'todo', user_id: 0, ordre: 0 };
      this.selected = null;
      this.closePopup();
    },
    (error) => {
      this.toastr.error('Erreur lors de la création de la tâche');
      console.error(error);
    }
  );
}

  getUserById(id: number): any {
  return this.allusers?.find(u => u.id === id);
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
sanitizeDescription(desc: string): string {
  const div = document.createElement('div');
  div.innerHTML = desc;

  const images = div.querySelectorAll('img');
  images.forEach(img => {
    img.style.maxWidth = '100%';
    img.style.width = '150px';
    img.style.height = 'auto';
  });

  return div.innerHTML;
}
  ajouterCommentaire(tacheId: number): void {
    const content = this.newComment[tacheId];
    if (!content || content.trim() === '') return;

    this.apiService.updateCommentaireTache(tacheId, content).subscribe(() => {
      this.newComment[tacheId] = '';

      // 🔄 Rafraîchir la tâche affichée si nécessaire
      const tache = this.taches.find(t => t.id === tacheId);
      if (tache) {
        if (!tache.comments) tache.comments = [];
        tache.comments.push({
          id: Date.now(), // temporaire, en attendant un vrai ID du backend
          content,
          created_at: new Date().toISOString()
        });
      }

      if (this.selectedshowTache?.id === tacheId) {
        if (!this.selectedshowTache.comments) this.selectedshowTache.comments = [];
        this.selectedshowTache.comments.push({
          id: Date.now(),
          content,
          created_at: new Date().toISOString()
        });
      }
    });
  }



  showHiddenUsersModal: boolean = false;

get hiddenUsers(): any[] {
  return this.allusers && this.allusers.length > 5
    ? this.allusers.slice(5)
    : [];
}

toggleShowAllUsers(): void {
  this.showHiddenUsersModal = true;
}

closeHiddenUsersModal(): void {
  this.showHiddenUsersModal = false;
}

selectUserFromModal(user: any): void {
  this.selectedUser = user;
  this.displayStyle = 'block';
  this.showHiddenUsersModal = false;
}
searchTerm: string = '';

filteredUsers(): any[] {
  return this.allusers?.filter(user =>
    user.name.toLowerCase().includes(this.searchTerm.toLowerCase())
  );
}
}
