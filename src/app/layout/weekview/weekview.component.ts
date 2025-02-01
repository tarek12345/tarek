
import { Component, Input } from '@angular/core';
import { format, startOfWeek, endOfWeek, getMonth, getYear, addDays } from 'date-fns';
import { fr } from 'date-fns/locale';

@Component({
  selector: 'app-weekview',
  standalone: false,
  templateUrl: './weekview.component.html',
  styleUrls: ['./weekview.component.css'] // Correction de 'styleUrl' en 'styleUrls'
})
export class WeekviewComponent {
  currentYear: number = new Date().getFullYear(); 
  selectedYear: number = this.currentYear; 
  currentMonth: number = new Date().getMonth(); 
  startYear: number = 2020; 
  endYear: number = 2030; 
  @Input() itemuser: any;
  displayStyle: string = "none"; // Contrôle l'affichage du modal
  selectedUser:  { weekRange: string, days: string[] } | null = null; // Typage de selectedUser 

  ngOnInit(): void {
    // Initialisation si nécessaire
  }

  openPopup(week: { weekRange: string, days: string[] }): void {
    this.selectedUser  = week; // Stocker la semaine sélectionnée
    this.displayStyle = "block"; // Afficher le modal
  }

  closePopup() {
    this.displayStyle = "none";
  }

  // Liste des années disponibles
  getYearsList(): number[] {
    return Array.from({ length: this.endYear - this.startYear + 1 }, (_, i) => this.startYear + i);
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

  // Mettre à jour l'année sélectionnée
  onYearChange(event: Event): void {
    this.selectedYear = parseInt((event.target as HTMLSelectElement).value, 10);
  }
  getHoursWorkedForDate(date: Date): number {
    // Remplacez cette logique par celle qui correspond à votre structure de données
    // Par exemple, si vous avez un tableau d'heures travaillées par jour, vous pouvez faire quelque chose comme :
    const hoursWorked = this.itemuser.hoursWorked.find((entry: any) => {
      return new Date(entry.date).toDateString() === date.toDateString();
    });
  
    return hoursWorked ? hoursWorked.durationInSeconds : 0; // Retourner 0 si aucune heure n'est trouvée
  }
}