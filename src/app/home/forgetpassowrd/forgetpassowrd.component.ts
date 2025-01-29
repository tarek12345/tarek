import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-forgetpassowrd',
  templateUrl: './forgetpassowrd.component.html',
  styleUrls: ['./forgetpassowrd.component.css'],
  standalone : false
})
export class ForgetpassowrdComponent implements OnInit {
  @Input() displayStyleChild: string = "none"; // Reçoit la variable du parent
  @Output() closeEvent = new EventEmitter<void>(); // Émet un événement pour fermer le modal

  email: string = ''; // Adresse email pour réinitialisation
  message: string = '';
  constructor(
    private authService: AuthService, // Service d'authentification
    private toastr: ToastrService // Service pour afficher des notifications
  ) {}

  ngOnInit(): void {}

  closePopup(): void {
    this.displayStyleChild = "none"; // Ferme localement le popup
    this.closeEvent.emit(); // Notifie le parent pour fermer le modal
  }

 // Demander un email pour réinitialiser le mot de passe
 forgetPassword(): void {
  this.authService.forgotPassword(this.email).subscribe(
    response => {
      this.toastr.success(response.message);
      this.message = response.message;
    },
    error => {
      this.toastr.error('Erreur lors de l\'envoi du lien de réinitialisation.');
    }
  );
}
}
