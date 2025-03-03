import { Component, Input } from '@angular/core';
import { format, startOfWeek, endOfWeek, getWeek, addDays, getMonth } from 'date-fns';
import { fr } from 'date-fns/locale';

@Component({
  selector: 'app-weekview',
  templateUrl: './weekview.component.html',
  styleUrls: ['./weekview.component.css'],
  standalone: false
})
export class WeekviewComponent {
  currentYear: number = new Date().getFullYear();
  currentMonth: number = new Date().getMonth();
  selectedYear: number = this.currentYear;
  startYear: number = 2025;
  endYear: number = 2040;
  @Input() itemuser: any;

  getWorkDays(): { day: string, hours: string , hourszero:string}[] {
    const history = this.itemuser?.history;
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

           };
        }
        return null;
      })
      .filter(day => day !== null); // Supprimer les jours qui ne correspondent pas à la semaine actuelle
  }
  isCurrentDay(day: string): boolean {
    const today = format(new Date(), 'EEEE', { locale: fr }); // Récupère le jour actuel en français
    return today === day;
  }
}
