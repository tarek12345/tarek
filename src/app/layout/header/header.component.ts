import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../services/user-service.service';
import { ApiService } from '../../services/api.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  standalone : false
})
export class HeaderComponent implements OnInit {
  @Input() datauser: any;
  public history: any[] = [];
  public error: string | null = null;
  displayStyle: string = "none"; // Contrôle l'affichage du modal
  public todaySchedule: any = null; // Horaire du jour actuel
  public lastPointage: any = null;  // Dernier pointage
  constructor(
    private userService: UserService,
    private apiService: ApiService, 
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    console.log("--->datauserdatauserdatauser",this.datauser);
    
    this.GetUserSByid()
  }
  GetUserSByid() {
    this.apiService.GetUserServiceByid(this.datauser.id).subscribe(data => {
      this.datauser = data.user;
      this.getTodayWorkSchedule(); // Met à jour l'horaire du jour
      this.getLastPointage(); // Récupère le dernier pointage
    });
  }

  getTodayWorkSchedule() {
    if (!this.datauser.work_schedule) return;

    const daysMap: { [key: number]: string } = {
      1: 'lundi',
      2: 'mardi',
      3: 'mercredi',
      4: 'jeudi',
      5: 'vendredi',
      6: 'samedi',
      0: 'dimanche'
    };

    const today = new Date().getDay();
    const todayName = daysMap[today];

    this.todaySchedule = this.datauser.work_schedule[todayName] || null;
  }

  getLastPointage() {
    if (this.datauser.pointages && this.datauser.pointages.length > 0) {
      // Récupérer le dernier pointage (le dernier élément du tableau)
      this.lastPointage = this.datauser.pointages[this.datauser.pointages.length - 1];
    } else {
      this.lastPointage = null;
    }
  }

  // Fonction pour ajouter un zéro devant les nombres inférieurs à 10
  pad(num: number): string {
    return num < 10 ? '0' + num : num.toString();
  }
  formatTime(totalHours: number): string {
    const hours = Math.floor(totalHours);
    const minutes = Math.round((totalHours - hours) * 60);
    return `${this.padZero(hours)}:${this.padZero(minutes)}`;
  }
  
  padZero(value: number): string {
    return value < 10 ? `0${value}` : `${value}`;
  }
  logout() {
    this.userService.clearUserInfo();
    this.toastr.success('Déconnexion réussie', 'Succès');
    this.router.navigate(['/']);
  }
  openPopup() { 
    this.displayStyle = "block"; 
  }
  closePopup() { 
    this.displayStyle = "none"; 
  }
}
