import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from '../../services/api.service';
import { UserService } from '../../services/user-service.service';

@Component({
  selector: 'app-secttings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
  standalone: false,
})
export class SettingsComponent implements OnInit {
  @Input() userdetaile: any; // Détails de l'utilisateur passés en entrée
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
    private router: Router
  ) {}

  ngOnInit(): void {
    this.GetUserSByid();
  }

  GetUserSByid() {
    this.apiService.GetUserServiceByid(this.userdetaile.id).subscribe((data) => {
      this.userdetaile = data.user;
    });
  }

  // Méthode pour vérifier si un champ a été modifié
  isAnyFieldModified(): boolean {
    return Object.values(this.fieldsToUpdate).some((isModified) => isModified);
  }

  // Méthode pour mettre à jour les informations de l'utilisateur
  updateUser() {
    const updatedData = { ...this.userdetaile };

    for (const key in this.fieldsToUpdate) {
      if (!this.fieldsToUpdate[key]) {
        updatedData[key] = this.userdetaile[key]; // Ajouter la valeur actuelle du champ
      }
    }

    if (this.userdetaile.profile_image instanceof File) {
      const file = this.userdetaile.profile_image;
      const reader = new FileReader();
      reader.onloadend = () => {
        updatedData.profile_image = reader.result as string; // Base64
        this.sendUpdateRequest(updatedData);
      };

      reader.readAsDataURL(file);
    } else {
      this.sendUpdateRequest(updatedData);
    }
  }

  // Méthode pour envoyer la requête de mise à jour
  private sendUpdateRequest(updatedData: any) {
    this.apiService.updateUser(updatedData, this.userdetaile.id).subscribe(
      (response) => {
        console.log('Employé mis à jour avec succès :', response);
        this.toastr.success('Employé mis à jour avec succès', 'Succès');
        window.location.reload();
      },
      (error) => {
        console.error('Erreur lors de la mise à jour de l\'employé :', error);
        this.toastr.error('Erreur lors de la mise à jour de l\'employé.', 'Erreur');
      }
    );
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.userdetaile.profile_image = input.files[0];
      this.markFieldAsModified('profile_image');
    }
  }

  // Méthode pour marquer un champ comme modifié
  markFieldAsModified(field: string) {
    this.fieldsToUpdate[field] = true;
  }
}
