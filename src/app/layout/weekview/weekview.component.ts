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
  getWorkDays(): { day: string, hours: string }[] {
    const workSchedule = this.itemuser?.work_schedule;
    if (!workSchedule) {
      return [];
    }
  
    return [
      { day: workSchedule.lundi.name, hours: workSchedule.lundi.formatted_hours },
      { day: workSchedule.mardi.name, hours: workSchedule.mardi.formatted_hours },
      { day: workSchedule.mercredi.name, hours: workSchedule.mercredi.formatted_hours },
      { day: workSchedule.jeudi.name, hours: workSchedule.jeudi.formatted_hours },
      { day: workSchedule.vendredi.name, hours: workSchedule.vendredi.formatted_hours }
    ];
  }

}
