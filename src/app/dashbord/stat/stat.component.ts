import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from '../../services/api.service';
import { UserService } from '../../services/user-service.service';

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



initializeUser(): void {
  const user = this.userService.getUserInfo();
  if (user) {
      this.userId = user.id;
      this.apiService.GetUserServiceByid(this.userId).subscribe(
          (response: any) => {
              this.userdetaile = response.user;
              this.status = response.user.status;
              this.totalTime = response.user.counter || 0;
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
    // Récupérer l'état actuel depuis le backend
    this.apiService.getActiveCounter(this.userId).subscribe(
        (response: any) => {
            this.totalTime = response.counter || 0; // Mettre à jour le compteur avec la valeur de l'API
            this.updateCounterDisplay(this.totalTime);

            // Vérifier si l'utilisateur est "au bureau"
            if (response.status === 'au bureau') {
                this.status = 'au bureau';
                this.startCounter(); // Démarrer le compteur seulement si l'utilisateur est "au bureau"
            } else {
                this.status = 'hors ligne'; // Sinon, l'utilisateur est "hors ligne"
            }
        },
        (error) => {
            console.error('Erreur lors de la récupération du compteur actif :', error);
            this.status = 'hors ligne'; // Par défaut, l'utilisateur est "hors ligne" en cas d'erreur
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

    if(this.userdetaile.role === 'administrator'){
      this.displayStyle = "block"; // Afficher le modal
    }
 else{
  this.displayStyle = "none"; // Afficher le modal
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
  padZero(value: number): string {
    return value < 10 ? `0${value}` : `${value}`;
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
    this.stopCounter(); // Arrêter le compteur immédiatement côté front-end

    try {
        const response = await this.apiService.registerDeparture(this.userId, {
            arrival_date: this.arrivalDate,
            last_departure: this.departureDate,
            session_duration: this.formatDuration(this.totalTime),
            total_hours: (this.totalTime / 3600).toFixed(2),
        }).toPromise();

        this.toastr.success('Départ enregistré avec succès.');
        this.status = 'hors ligne';

        // Mettre à jour les données côté front-end avec la réponse du back-end
        this.totalTime = response.totalTime; // Assurez-vous que le back-end renvoie la valeur mise à jour
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
}