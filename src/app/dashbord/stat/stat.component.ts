import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from '../../services/api.service';
import { UserService } from '../../services/user-service.service';
import { format, startOfWeek, endOfWeek, getMonth, getYear, addDays } from 'date-fns';
import { fr } from 'date-fns/locale';
@Component({
  selector: 'app-stat',
  templateUrl: './stat.component.html',
  styleUrls: ['./stat.component.css'],
  standalone: false
})
export class StatComponent implements OnInit {
  @Input() datauser: any;
  @Input() userdetaile: any;
  @Input() historyAll: any;
  currentYear: number = new Date().getFullYear(); 
  selectedYear: number = this.currentYear; 
  currentMonth: number = new Date().getMonth(); 
  selectedUserday:  { weekRange: string, days: string[] } | null = null; // Typage de selectedUser 
  currentTime: string = '';
  user: any;
  selectedUser :any
  userId: number = 0;
  location: string = '';
  arrivalDate: string = '';
  departureDate: string = '';
  totalTime: number = 0; // Temps total en secondes
  interval: any; // Intervalle pour le compteur
  counter: string = '00:00:00'; // Compteur initialisé à 00:00:00
  status: string = 'hors ligne'; // Statut par défaut
  loading: boolean = true; // Indicateur de chargement
  error: string | null = null; // Pour gérer les erreurs
  displayStyle: string = "none"; // Contrôle l'affichage du modal
  allUsers: any[] = [];
  maxDailyHours: number = 8 * 3600; // 8 heures converties en secondes
  dailyTotal: number = 0; // Total des heures travaillées par jour
  weeklyTotal: number = 0; // Total hebdomadaire
  monthlyTotal: number = 0; // Total mensuel
  constructor(
    private apiService: ApiService,
    private userService: UserService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeUser();
    this.loadCounterState();
  
}

initializeUser (): void {
  const user = this.userService.getUserInfo();
  if (user) {
    this.userId = user.id;
    this.apiService.GetUserServiceByid(this.userId).subscribe(
      (response: any) => {
        this.userdetaile = response.user;
        this.status = response.user.status;
        this.totalTime = response.user.counter || 0;
        this.dailyTotal = response.user.daily_hours || 0;
        this.weeklyTotal = response.user.weekly_hours || 0;
        this.monthlyTotal = response.user.monthly_hours || 0;
        this.updateCounterDisplay(this.totalTime);

        if (this.status === 'au bureau') {
          this.startCounter(); // Démarrer le compteur si l'utilisateur est "au bureau"
        }
      },
      (error) => {
        console.error('Erreur lors de la récupération des informations de l\'utilisateur :', error);
      }
    );
  }
}

loadCounterState(): void {
  this.apiService.getActiveCounter(this.userId).subscribe(
    (response: any) => {
      this.totalTime = response.counter || 0;
      this.dailyTotal = response.daily_hours || 0;
      this.weeklyTotal = response.weekly_hours || 0;
      this.monthlyTotal = response.monthly_hours || 0;
      this.updateCounterDisplay(this.totalTime);

      if (response.status === 'au bureau') {
        this.status = 'au bureau';
        this.startCounter();
      } else {
        this.status = 'hors ligne';
      }
    },
    (error) => {
      console.error('Erreur lors de la récupération du compteur actif :', error);
      this.status = 'hors ligne';
    }
  );


  this.GetUsers();
  this.GetUserSByid();
  this.updateCurrentTime();
}

  updateCurrentTime(): void {
    setInterval(() => {
      this.currentTime = new Date().toLocaleTimeString();
    }, 1000);
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


startCounter(): void {
  if (!this.interval) {
      this.interval = setInterval(() => {
          this.totalTime++;
          this.updateCounterDisplay(this.totalTime);
          this.userService.setEncryptedItem('totalTime', this.totalTime.toString());
      }, 1000);
  }
}
stopCounter(): void {
    if (this.interval) {
        clearInterval(this.interval);
        this.interval = null;
    }
}
  calculateWeeklyAndMonthlyHours(): void {
    // Calculer les heures hebdomadaires et mensuelles
    this.weeklyTotal = this.dailyTotal * 5; // 5 jours de travail par semaine
    this.monthlyTotal = this.dailyTotal * 22; // 22 jours de travail par mois
  }

  updateCounterDisplay(totalTime: number): void {
    const hours = Math.floor(totalTime / 3600);
    const minutes = Math.floor((totalTime % 3600) / 60);
    const seconds = Math.floor(totalTime % 60);

    this.counter = `${this.padZero(hours)}:${this.padZero(minutes)}:${this.padZero(seconds)}`;
  }


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
  async onArrival(): Promise<void> {
    if (this.status === 'au bureau') {
      this.toastr.warning('Vous êtes déjà au bureau.');
      return;
    }
  
    try {
      const location = await this.getLocation();
      this.arrivalDate = new Date().toISOString();
      this.status = 'au bureau';
  
      this.apiService.registerArrival(this.userId, {
        arrival_date: this.arrivalDate,
        location,
      }).subscribe(() => {
        this.toastr.success('Arrivée enregistrée avec succès.');
        this.userService.setEncryptedItem('arrivalDate', this.arrivalDate);
        this.userService.setEncryptedItem('status', this.status);
  
        // Démarrer le compteur seulement après avoir enregistré l'arrivée
        this.startCounter();
      });
    } catch (error) {
      this.toastr.error('Erreur lors de l\'arrivée.');
    }
  }

  async onDeparture(): Promise<void> {
    if (this.status === 'hors ligne') {
        this.toastr.warning('Vous n\'êtes pas au bureau.');
        return;
    }

    this.departureDate = new Date().toISOString();
    this.stopCounter();

    try {
        const response = await this.apiService.registerDeparture(this.userId, {
            arrival_date: this.arrivalDate,
            last_departure: this.departureDate,
            session_duration: this.formatDuration(this.totalTime),
            total_hours: (this.totalTime / 3600).toFixed(2),
            daily_hours: this.dailyTotal / 3600, // Convertir en heures pour l'envoi au backend
            weekly_hours: this.weeklyTotal / 3600,
            monthly_hours: this.monthlyTotal / 3600,
        }).toPromise();

        this.toastr.success('Départ enregistré avec succès.');
        this.status = 'hors ligne';

        // Mettre à jour les totaux
        this.totalTime = response.totalTime; // Total en secondes
        this.dailyTotal = response.daily_hours * 3600; // Convertir en secondes
        this.weeklyTotal = response.weekly_hours * 3600; // Convertir en secondes
        this.monthlyTotal = response.monthly_hours * 3600; // Convertir en secondes

        // Mettre à jour l'affichage du compteur
        this.counter = this.formatDuration(this.totalTime);
    } catch (error) {
        this.toastr.error('Erreur lors de l\'enregistrement du départ.');
    }
}

  async getLocation(): Promise<string> {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve(`Latitude: ${position.coords.latitude}, Longitude: ${position.coords.longitude}`);
        },
        () => {
          reject('Impossible de récupérer la localisation.');
        }
      );
    });
  }
  formatDuration(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
  
    return `${this.padZero(hours)}:${this.padZero(minutes)}:${this.padZero(secs)}`;
  }
  
  padZero(value: number): string {
    return value < 10 ? `0${value}` : `${value}`;
  }
 

  getProgressPercentage(totalTimeSeconds: number): number {
    const percentage = (totalTimeSeconds / this.maxDailyHours) * 100;
    return Math.min(percentage, 100); // Ne pas dépasser 100%
  }
  GetUserSByid(): void {
    this.apiService.GetUserServiceByid(this.userId).subscribe((data) => {
      this.userdetaile = data.user;
    });
  }

  getUserCountByStatus(status: string): number {
    return this.allUsers.filter(user => user.role !== 'administrator' && user.status === status).length;
  }
    // Récupérer les semaines du mois actuel sans samedi et dimanche
    getCurrentMonthWeeks(): { month: string, weeks: { weekRange: string, days: string[], totalHours: number }[] } {
      return {
        month: format(new Date(this.selectedYear, this.currentMonth, 1), 'MMMM', { locale: fr }),
        weeks: this.getWeeksInMonth(this.currentMonth, this.selectedYear)
      };
    }
      // Récupérer les semaines d'un mois donné en excluant samedi et dimanche
      getWeeksInMonth(month: number, year: number): { weekRange: string, days: string[], totalHours: number }[] {
        const weeks = [];
        let date = new Date(year, month, 1);
        
        while (getMonth(date) === month) {
          let start = startOfWeek(date, { weekStartsOn: 1 }); // Commencer lundi
          let end = endOfWeek(start, { weekStartsOn: 1 }); // Finir dimanche
      
          // Supprimer samedi et dimanche
          let adjustedEnd = addDays(end, -2);
          
          // Récupérer les jours de la semaine
          const days: string[] = [];
          let totalHours = 0; // Initialiser le total des heures pour cette semaine
          for (let d = new Date(start); d <= adjustedEnd; d.setDate(d.getDate() + 1)) {
            days.push(format(new Date(d), 'd MMMM', { locale: fr }));
            // Ajoutez ici la logique pour calculer les heures pour chaque jour
            // totalHours += ...; // Ajoutez les heures de ce jour
          }
      
          weeks.push({
            weekRange: `${format(start, 'd')} - ${format(adjustedEnd, 'd MMMM', { locale: fr })}`,
            days: days,
            totalHours: totalHours // Ajouter le total des heures pour cette semaine
          });
      
          date = new Date(end);
          date.setDate(date.getDate() + 1);
        }
        return weeks;
      }

      
}