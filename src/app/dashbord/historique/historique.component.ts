import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { format, startOfWeek, endOfWeek } from 'date-fns';
import { fr } from 'date-fns/locale';

@Component({
  selector: 'app-historique',
  standalone: false,
  templateUrl: './historique.component.html',
  styleUrl: './historique.component.css'
})
export class HistoriqueComponent implements OnChanges {

  @Input() userdetaile: any;
  user: any = null;

  selectedDate: string = '';
  totalMonthHours: string = '00:00:00';

  workDays: { date: string, month: string, week: string, day: string, hours: string }[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    const change = changes['userdetaile'];
    if (change?.currentValue) {
      this.user = change.currentValue.user ?? change.currentValue;
      this.calculateWorkDays();
    }
  }

  calculateWorkDays(): void {
    const history = this.user?.history;

    if (!history) {
      this.workDays = [];
      this.totalMonthHours = '00:00:00';
      return;
    }

    const today = new Date();
    const startWeek = startOfWeek(today, { weekStartsOn: 1 });
    const endWeek = endOfWeek(today, { weekStartsOn: 1 });

    let totalSeconds = 0;

    this.workDays = Object.values(history)
      .map((data: any) => {
        const current = new Date(data.date);

        if (current >= startWeek && current <= endWeek) {
          const t = data.total_hours.split(':').map(Number);
          totalSeconds += t[0] * 3600 + t[1] * 60 + t[2];

          return {
            date: format(current, 'dd/MM/yyyy'),
            month: data.month,
            week: data.week,
            day: data.day,
            hours: data.total_hours
          };
        }
        return null;
      })
      .filter(day => day !== null) as any[];

    this.formatTotalHours(totalSeconds);
  }

  filterBySelectedDate(): void {
    if (!this.selectedDate) {
      this.calculateWorkDays();
      return;
    }

    const history = this.user?.history;
    if (!history) return;

    const selected = new Date(this.selectedDate);
    const y = selected.getFullYear();
    const m = selected.getMonth();
    const d = selected.getDate();

    let totalSeconds = 0;

    this.workDays = Object.values(history)
      .map((data: any) => {
        const current = new Date(data.date);

        if (
          current.getFullYear() === y &&
          current.getMonth() === m &&
          current.getDate() === d
        ) {
          const t = data.total_hours.split(':').map(Number);
          totalSeconds += t[0] * 3600 + t[1] * 60 + t[2];

          return {
            date: format(current, 'dd/MM/yyyy'),
            month: data.month,
            week: data.week,
            day: data.day,
            hours: data.total_hours
          };
        }
        return null;
      })
      .filter(day => day !== null) as any[];

    this.updateMonthlyTotal();
  }

  private updateMonthlyTotal(): void {
    const history = this.user?.history;
    if (!history) {
      this.totalMonthHours = '00:00:00';
      return;
    }

    const selected = this.selectedDate ? new Date(this.selectedDate) : new Date();
    const month = selected.getMonth();
    const year = selected.getFullYear();

    let totalSeconds = 0;

    Object.values(history).forEach((data: any) => {
      const current = new Date(data.date);

      if (current.getMonth() === month && current.getFullYear() === year) {
        const t = data.total_hours.split(':').map(Number);
        totalSeconds += t[0] * 3600 + t[1] * 60 + t[2];
      }
    });

    this.formatTotalHours(totalSeconds);
  }

  private formatTotalHours(totalSeconds: number): void {
    const h = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
    const s = (totalSeconds % 60).toString().padStart(2, '0');
    this.totalMonthHours = `${h}:${m}:${s}`;
  }
}
