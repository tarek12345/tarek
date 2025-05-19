import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../services/auth.service';
import introJs from 'intro.js';
@Component({
  selector: 'app-reset-password',
  templateUrl: './resetpassword.component.html',
  styleUrls: ['./resetpassword.component.css'],
  standalone : false
})
export class ResetpasswordComponent implements OnInit {
  token: string = '';
  email: string = ''; // Récupéré depuis l'URL ou une autre source
  newPassword: string = '';
  confirmPassword: string = '';
intro = introJs();
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.token = params['token'] || '';
      this.email = params['email'] || ''; // Assurez-vous que l'email est récupéré
    });
    this.startTour()
  }
 startTour() {
    const intro = introJs(); // ✅ Crée l'instance

    intro.setOptions({
      steps: [
        { intro: 'Oublier ma  mot de pass!' },
        { element: '#step1', intro: 'tapez  mail que vous avez recupére.' },
        { element: '#step2', intro: 'tu as trouvera lien  dasnq  boite  mail.' }
      ]
    });

    intro.start();
  }
  
  resetPassword(): void {
    if (this.newPassword !== this.confirmPassword) {
      this.toastr.error('Les mots de passe ne correspondent pas.', 'Erreur');
      return;
    }

    const data = {
      token: this.token,
      email: this.email,
      password: this.newPassword,
      password_confirmation: this.confirmPassword
    };

    this.authService.resetPassword(data).subscribe(
      (response) => {
        this.toastr.success('Mot de passe réinitialisé avec succès.', 'Succès');
        this.router.navigate(['/login']);
      },
      (error) => {
        this.toastr.error(error.error.message || 'Une erreur est survenue.', 'Erreur');
        if (error.error.errors) {
          if (error.error.errors.email) {
            this.toastr.error(error.error.errors.email[0], 'Erreur');
          }
          if (error.error.errors.password) {
            this.toastr.error(error.error.errors.password[0], 'Erreur');
          }
        }
      }
    );
  }
}
