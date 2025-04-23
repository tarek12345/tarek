import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { format, startOfWeek, endOfWeek } from 'date-fns';
import { fr } from 'date-fns/locale';

@Component({
  selector: 'app-weekview',
  templateUrl: './weekview.component.html',
  styleUrls: ['./weekview.component.css'],
  standalone: false
})
export class WeekviewComponent implements OnChanges {
  currentYear: number = new Date().getFullYear();
  currentMonth: number = new Date().getMonth();
  selectedYear: number = this.currentYear;
  startYear: number = 2025;
  endYear: number = 2040;
  @Input() itemuser: any;

  workDays: { month: string, week: string, day: string, hours: string, hourszero: string }[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['itemuser']) {
      this.calculateWorkDays();
    }
  }

  calculateWorkDays(): void {
    const history = this.itemuser?.history;
  
    
    if (!history) {
      this.workDays = [];
      return;
    }

    const today = new Date();
    const startOfCurrentWeek = startOfWeek(today, { weekStartsOn: 1 });
    const endOfCurrentWeek = endOfWeek(today, { weekStartsOn: 1 });

    this.workDays = Object.keys(history)
      .map(date => {
      
        const dayData = history[date];
        const currentDate = new Date(dayData.date);
        console.log("===================",currentDate);

        if (currentDate >= startOfCurrentWeek && currentDate <= endOfCurrentWeek) {
          return {
            month: dayData.month,
            week: dayData.week,
            day: dayData.day,
            hours: dayData.total_hours,
            hourszero: dayData.arrival_date,
          };
        }
        return null;
      })
      .filter(day => day !== null) as any[];
  }

  isCurrentDay(day: string): boolean {
    const today = format(new Date(), 'EEEE', { locale: fr });
    return today === day;
  }
}
