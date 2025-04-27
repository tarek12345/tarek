import { Component, Input, OnInit, ViewChild, ElementRef,AfterViewInit   } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService, PaginatedUsers } from '../../services/api.service';
import { UserService } from '../../services/user-service.service';
import { format, startOfWeek, endOfWeek, getMonth, getYear, addDays } from 'date-fns';
import { fr } from 'date-fns/locale';
declare var bootstrap: any;
@Component({
  selector: 'app-detaileuser',
  templateUrl: './detaileuser.component.html',
  styleUrls: ['./detaileuser.component.css'],
  standalone: false
})
export class Detaileuser implements OnInit {
  @Input() datauser: any;
  @Input() userdetaile: any;
  @Input() historyAll: any;
  filteredUsers: any[] = [];  // Cette liste contiendra les utilisateurs filtrés

  currentYear: number = new Date().getFullYear(); 
  selectedYear: number = this.currentYear; 
  currentMonth: number = new Date().getMonth(); 
  selectedUserday:  { weekRange: string, days: string[] } | null = null; // Typage de selectedUser 
  currentTime: string = '';
  user: any ;
  selectedUser :any =[]
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
  allUsers: any;
  dailyTotal: number = 0; // Total des heures travaillées par jour
  weeklyTotal: number = 0; // Total hebdomadaire
  monthlyTotal: number = 0; // Total mensuel
  latitude: number | null = null;
  longitude: number | null = null;
  address: string = 'Adresse non disponible';
  currentPage: number = 1;
  lastPage: number = 1;
  perPage: number = 4;
  total: number = 0;

    // Déclaration du graphique
constructor(
    private apiService: ApiService,
    private userService: UserService,
    private toastr: ToastrService,
    private router: Router
  ) {
    
  }
  
  ngAfterViewInit() {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    tooltipTriggerList.map((tooltipTriggerEl: any) => new bootstrap.Tooltip(tooltipTriggerEl))
  }

  async ngOnInit(): Promise<void> {
    await this.initializeUser();
    this.loadCounterState();
    this.checkCounterReset(); 
    await this.GetUserSByid(); // Ensure this happens after loading user data
  }
 
  checkCounterReset(): void {
    const interval = setInterval(() => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      
      if (hours === 0 && minutes === 0) {
        this.resetCounter();
        clearInterval(interval); // Stop checking after reset
      }
    }, 60000); // Check every minute
  }
  

  resetCounter(): void {
    this.stopCounter(); // Arrêter le compteur actuel
    this.totalTime = 0; // Réinitialiser le compteur à zéro
    this.dailyTotal = 0; // Réinitialiser le total des heures journalières
    this.weeklyTotal = 0; // Réinitialiser le total des heures hebdomadaires
    this.monthlyTotal = 0; // Réinitialiser le total des heures mensuelles
    this.updateCounterDisplay(this.totalTime); // Mettre à jour l'affichage du compteur
    this.userService.setEncryptedItem('totalTime', '0'); // Sauvegarder la valeur réinitialisée dans le stockage
    this.status = 'hors ligne'; // Réinitialiser le statut de l'utilisateur
    this.toastr.info('Le compteur a été réinitialisé automatiquement après 24 heures sans activité.');
  }
  initializeUser(): void {
    const user = this.userService.getUserInfo();
  
    if (user) {
      this.userId = user.id;
  
      this.apiService.GetUserServiceByid(this.userId).subscribe(
        (response: any) => {
          this.userdetaile = response.user;
          const history = response.user.history          
          const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
          const todayPointage = history.find((p: any) => p.date === today);
          history.find((p: any) => p.date === today);
     
         
   
          if (todayPointage) {
            this.totalTime = todayPointage.counter || 0;
            this.dailyTotal = todayPointage.counter || 0;
            this.status = todayPointage.status || 'hors ligne';
            this.updateCounterDisplay(this.totalTime);
          
            if (this.status === 'au bureau') {
              this.startCounter(); // Only start the counter if the user is 'au bureau'
            }
          }
           else {
            this.totalTime = 0;
            this.dailyTotal = 0;
            this.status = 'hors ligne';
            this.updateCounterDisplay(0);
          }
  
          // Stocker le total mensuel global si nécessaire
          const totalHoursSeconds: number = response.user.counter || 0;
          this.monthlyTotal = totalHoursSeconds;
  
        },
        (error) => {
          console.error('Erreur lors de la récupération des infos utilisateur:', error);
        }
      );
    }
  }
  
  
  
  
  // Fonction de conversion de l'heure au format "hh:mm:ss" en secondes
  convertTimeToSeconds(timeString: string): number {
    const timeParts = timeString.split(':'); // Divise la chaîne en heures, minutes et secondes
    const hours = parseInt(timeParts[0], 10) || 0;
    const minutes = parseInt(timeParts[1], 10) || 0;
    const seconds = parseInt(timeParts[2], 10) || 0;
    
    // Convertir en secondes
    return hours * 3600 + minutes * 60 + seconds;
  }
  updateUserData() {
    this.GetUserSByid() 
  }

  loadCounterState(): void {
    this.apiService.getActiveCounter(this.userId).subscribe(
      (response: any) => {
        this.totalTime = response.hours_counter || 0;
        this.dailyTotal = response.daily_hours || 0;
        this.weeklyTotal = response.weekly_hours || 0;
        this.monthlyTotal = response.monthly_hours || 0;
  
        // S'assurer que le status est bien mis à jour
        this.status = response.status || 'hors ligne';
  
        if (this.status === 'au bureau') {
          this.startCounter();
        } else {
          // Si l'utilisateur est hors ligne → afficher 00:00:00
          this.totalTime = 0;
          this.updateCounterDisplay(0);
          this.stopCounter();
        }
      },
      (error) => {
        console.error('Erreur lors de la récupération du compteur actif :', error);
        this.status = 'hors ligne';
        this.totalTime = 0;
        this.updateCounterDisplay(0);
        this.stopCounter();
      }
    );
  
    this.GetUserSByid();
    this.GetUsers();
    this.updateCurrentTime();
  }
  


updateCurrentTime(): void {
  setInterval(() => {
    this.currentTime = new Date().toLocaleTimeString();
  }, 1000);
}


  openPopup(user: any): void {
    this.selectedUser = user; // Stocker l'utilisateur sélectionné
  this.selectedUserday =user
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

  padZero(value: number): string {
    return value < 10 ? `0${value}` : `${value}`;
  }
  
 GetAllusers : any
 GetUsers(page: number = 1) {
  this.apiService.GetUsers(page).subscribe((data) => {
 this.GetAllusers  =  data
    // Vérification de la présence des utilisateurs avant de les traiter
    if (data?.users && Array.isArray(data.users)) {
      this.allUsers = data.users.map(user => ({
        ...user,
        total_time_seconds: parseInt(sessionStorage.getItem('totalTime') || '0', 10),
        historyKeys: this.getHistoryKeys(user.history)
      }));

      // Initialiser filteredUsers avec les utilisateurs traités
      this.filteredUsers = [...this.allUsers];
    } else {
      console.warn('Aucun utilisateur trouvé dans la réponse de l\'API.');
      this.filteredUsers = [];  // Si aucun utilisateur trouvé, initialise filteredUsers comme un tableau vide
    }

    // Mise à jour des autres données de pagination
    this.currentPage = data.current_page;
    this.lastPage = data.last_page;
    this.total = data.total;
    this.loading = false;

  }, error => {
    console.log('Error:', error);  // Affiche l'erreur dans la console
    this.toastr.error('Erreur lors de la récupération des utilisateurs.');
    this.loading = false;
  });
}
getHistoryKeys(history: any): string[] {
  if (!history || typeof history !== 'object') {
    return [];
  }
  return Object.keys(history);
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

    this.apiService.registerArrival(this.userId, { arrival_date: this.arrivalDate, location })
      .subscribe(() => {
        this.toastr.success('Arrivée enregistrée avec succès.');
        this.userService.setEncryptedItem('arrivalDate', this.arrivalDate);
        this.userService.setEncryptedItem('status', this.status);
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
      daily_hours: this.dailyTotal
    }).toPromise();

    this.toastr.success('Départ enregistré avec succès.');
    this.userService.setEncryptedItem('departureDate', this.departureDate);
    this.status = 'hors ligne'; // Mise à jour du statut
    this.userService.setEncryptedItem('status', this.status);
    window.location.reload();

  } catch (error) {
    this.toastr.error('Erreur lors de l\'enregistrement du départ.');
  }
}

formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secondsLeft = seconds % 60;
  return `${hours}h ${minutes}m ${secondsLeft}s`;
}
getLocation(): Promise<string> {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        
        // Use OpenStreetMap Nominatim API to get the address
        const url = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1`;
        
        try {
          const response = await fetch(url);
          const data = await response.json();
          if (data && data.address) {
            // Resolve the address string
            const address = `${data.address.road || ''}, ${data.address.city || ''}, ${data.address.country || ''}`;
            resolve(address.trim());
          } else {
            reject('Adresse non disponible');
          }
        } catch (error) {
          reject('Impossible de récupérer l\'adresse.');
        }
      },
      () => {
        reject('Impossible de récupérer la localisation.');
      }
    );
  });
}


  
  
userdetaileid :any


  GetUserSByid(): void {
    this.apiService.GetUserServiceByid(this.userId).subscribe((data) => {
      this.userdetaileid = data.user;
    });
  }

  getCurrentWorkDay(): { day: string, hours: string, hourszero: string } | null {
    const history = this.userdetaileid?.history?.pointages;
    if (!history) return null;
  
    const todayStr = format(new Date(), 'yyyy-MM-dd');
    const currentDay = history.find((j: any) => j.date === todayStr);
  
    if (currentDay) {
      return {
        day: currentDay.day,
        hours: currentDay.total_hours,
        hourszero: currentDay.arrival_date
      };
    }
  
    return null;
  }
  
  
  isCurrentDay(day: string): boolean {
    const today = format(new Date(), 'EEEE', { locale: fr }); // ex: 'lundi'
    return today.toLowerCase() === day.toLowerCase(); // comparaison insensible à la casse
  }
  maxDailyHours: number = 8 * 60 * 60; // 8h en secondes

  getProgressPercentage(totalTimeSeconds: number): number {
    const percentage = (totalTimeSeconds / this.maxDailyHours) * 100;
    return Math.min(percentage, 100);
  }
  getUserCountByStatus(status: string): number {
    if (!this.allUsers) return 0;
    return this.allUsers.filter((user : any) => user.status === status).length;
  }
  
  onPageChange(page: number): void {
    if (page >= 1 && page <= this.lastPage) {
      this.GetUsers(page);
    }
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
      isWeekend(): boolean {
        const currentDay = new Date().getDay(); // 0 = dimanche, 6 = samedi
        return currentDay === 0 || currentDay === 6; // Retourne true si samedi ou dimanche
      }



 
      
}