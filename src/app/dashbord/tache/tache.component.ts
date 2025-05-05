import { Component, Input, SimpleChanges } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { UserService } from '../../services/user-service.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-tache',
  standalone: false,
  
  templateUrl: './tache.component.html',
  styleUrl: './tache.component.css'
})
export class TacheComponent {
  @Input() userdetaile :any;
  displayStyle: string = "none"; // Contrôle l'affichage du modal
  selectedUser :any =[]
  allusers :any =[]
  constructor(
    private apiService: ApiService,
    private userService: UserService,
    private toastr: ToastrService,
    private router: Router
  ) {}
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['userdetaile']) {
       this.allusers = changes['userdetaile']?.currentValue      
    }
  }
  addtask(){
    /* ajouter task*/
  }

  showAllUsers: boolean = false;

  get visibleUsers() {
    return this.allusers ? (this.showAllUsers ? this.allusers : this.allusers.slice(0, 5)) : [];
  }
  
  
  get hiddenUserCount() {
    return this.allusers && this.allusers.length > 5 ? this.allusers.length - 5 : 0;
  }
  
  
  toggleShowAllUsers() {
    this.showAllUsers = true;
  }
  
  openPopup(user: any): void {
    this.selectedUser = user; // Stocker l'utilisateur sélectionné
    if (this.userdetaile.role === 'administrator') {
      this.displayStyle = "block"; // Afficher le modal
    } else {
      this.displayStyle = "none"; // Cacher le modal
    }
  }

  closePopup() {
    this.displayStyle = "none";
  }
}
