import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../services/user-service.service';
import { ApiService } from '../../services/api.service';
import { format, startOfWeek, endOfWeek, getWeek, addDays, getMonth } from 'date-fns';

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
    if (!this.datauser.history) {
      this.todaySchedule = null;
      return;
    }
  
    const today = new Date();
    const todayDate = today.toISOString().split('T')[0]; // Format YYYY-MM-DD
  
    let todayPointageFound = false;
  
    // Vérifier si un pointage existe pour aujourd'hui
    for (const dayData of this.datauser?.history?.jours) {
      const date = dayData.date; // Utilisez la date complète pour la comparaison
      if (date.startsWith(todayDate)) {
        todayPointageFound = true;
        this.todaySchedule = {
          arrival_date: dayData.arrival_date || 'Non pointé',
          last_departure: dayData.last_departure || 'Non encore parti',
          location: dayData.location || 'Non précisée',
          pointages: dayData.pointages || []
        };
        break;
      }
    }
  
    if (!todayPointageFound) {
      this.todaySchedule = null;  // Aucun pointage pour aujourd'hui
    }
  }
  
  
  
  
  
  getLastPointage() {
    const history = this.datauser?.history;
    if (!history) {
      this.lastPointage = null;
      return;
    }
  
    // Récupérer tous les pointages
    let allPointages = Object.values(history.jours)
      .flatMap((day: any) => day.pointages)
      .sort((a: any, b: any) => new Date(b.last_departure).getTime() - new Date(a.last_departure).getTime());
  
    // Prendre le dernier pointage
    this.lastPointage = allPointages.length > 0 ? allPointages[0] : null;
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
  getTotalPointages(): number {
    return this.todaySchedule?.pointages?.length || 0;

  }
  
    getWorkDays(): { day: string, hours: string , hourszero:string, pointages:any}[] {
      const history = this.datauser?.history;
      if (!history) {
        return [];
      }
  
      // Récupérer la date actuelle
      const today = new Date();
      const startOfCurrentWeek = startOfWeek(today, { weekStartsOn: 1 }); // Lundi comme premier jour de la semaine
      const endOfCurrentWeek = endOfWeek(today, { weekStartsOn: 1 }); // Dimanche comme dernier jour de la semaine
  
      // Filtrer l'historique pour ne garder que les jours de la semaine actuelle
      return Object.keys(history)
        .map(date => {
          const dayData = history[date];
          const currentDate = new Date(dayData.date);
  
          // Vérifier si la date fait partie de la semaine actuelle
          if (currentDate >= startOfCurrentWeek && currentDate <= endOfCurrentWeek) {
            return {
              day: dayData.day,
              hours: dayData.total_hours,
              hourszero: dayData.arrival_date,
              pointages:dayData.pointages
             };
          }
          return null;
        })
        .filter(day => day !== null); // Supprimer les jours qui ne correspondent pas à la semaine actuelle
    }
}
