import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from '../../services/api.service';
import { UserService } from '../../services/user-service.service';
import { ChangeDetectorRef } from '@angular/core';
@Component({
  selector: 'app-secttings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
  standalone: false,
})
export class SettingsComponent implements OnInit {
  @Input() userdetaile: any = {}; // Au lieu de [] qui est un tableau

  fieldsToUpdate: any = {
    name: false,
    email: false,
    sexe: false,
    role: false,
    password: false,
    profile_image: false,
  };

  constructor(
    private apiService: ApiService,
    private userService: UserService,
    private toastr: ToastrService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    if (!this.userdetaile) {
      this.userdetaile = {}; // Assure que l'objet n'est jamais undefined
    }
    if (!this.userdetaile.sexe) {
      this.userdetaile.sexe = ''; // Valeur par défaut pour éviter les erreurs
    }
    if (!this.userdetaile.role) {
      this.userdetaile.role = ''; // Valeur par défaut
    }
  
    if (this.userdetaile.id) {
      this.GetUserSByid();
    }
  }
  

  GetUserSByid() {
    this.apiService.GetUserServiceByid(this.userdetaile.id).subscribe((data) => {
      this.userdetaile = data.user;
      this.cdr.detectChanges(); // Forcer la mise à jour de l'interface
    });
  }
  

  // Méthode pour vérifier si un champ a été modifié
  isAnyFieldModified(): boolean {
    return Object.values(this.fieldsToUpdate).some((isModified) => isModified);
  }

  // Méthode pour mettre à jour les informations de l'utilisateur
  updateUser() {
    const updatedData: any = { ...this.userdetaile };
  
    // Vérifier les champs modifiés
    for (const key in this.fieldsToUpdate) {
      if (!this.fieldsToUpdate[key]) {
        updatedData[key] = this.userdetaile[key];
      }
    }
  
    // Vérifier si une nouvelle image a été sélectionnée
    if (this.fieldsToUpdate.profile_image && this.userdetaile.profile_image instanceof File) {
      const file = this.userdetaile.profile_image;
      const reader = new FileReader();
      reader.onloadend = () => {
        updatedData.profile_image = reader.result as string; // Convertir en Base64
        this.sendUpdateRequest(updatedData);
      };
      reader.readAsDataURL(file);
    } else {
      // Si l'image n'a pas été changée, envoyer seulement l'ancienne URL sans modification
      delete updatedData.profile_image; // Ne pas inclure le champ dans la requête
      this.sendUpdateRequest(updatedData);
    }
  }
  

  // Méthode pour envoyer la requête de mise à jour
  private sendUpdateRequest(updatedData: any) {
    this.apiService.updateUser(updatedData, this.userdetaile.id).subscribe(
      (response) => {
        this.toastr.success('Employé mis à jour avec succès', 'Succès');
        this.GetUserSByid(); // Rafraîchir les données après mise à jour
       this.refreshPage();

      },
      (error) => {
        console.error("Erreur lors de la mise à jour de l'employé :", error);
        this.toastr.error("Erreur lors de la mise à jour de l'employé.", 'Erreur');
      }
    );
  }
  

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.userdetaile.profile_image = input.files[0]; // Stocker le fichier
      this.markFieldAsModified('profile_image');
    }
  }
  
  

  // Méthode pour marquer un champ comme modifié
  markFieldAsModified(field: string) {
    this.fieldsToUpdate[field] = true;
  }
  refreshPage() {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([this.router.url]);
    });
  }
} 