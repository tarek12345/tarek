
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ChartOptions, ChartData, ChartType } from 'chart.js';

interface Jour {
  date: string;
  day: string;
  month: string;
  week: number;
  arrival_date: string | null;
  last_departure?: string | null;
  location?: string | null;
  status?: string;
  pointages?: any[];
  total_hours: string;
  counter?: number;
}

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css'],
  standalone: false
})
export class ChartComponent implements OnChanges {
  @Input() chartusers: any;

  public barChartLabels: string[] = [];
  public totalHoursRaw: string[] = [];

  public barChartData: ChartData = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Heures travaillées',
        backgroundColor: 'rgba(83 , 88 , 217, 0.5)',
        borderColor: 'rgba(83, 88, 217, 1)',
        borderWidth: 1
      }
    ]
  };

  public barChartType: ChartType = 'bar';

  public barChartOptions: ChartOptions = {
    responsive: true,
    scales: {
      x: {
        title: {
          display: true,
          text: 'Jour & Date'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Durée (HH:MM:SS)'
        },
        beginAtZero: true,
        ticks: {
          stepSize: 60, // 1 minute en secondes
          callback: function (tickValue: string | number) {
            const value = typeof tickValue === 'string' ? parseFloat(tickValue) : tickValue;
            const hours = Math.floor(value / 3600);
            const minutes = Math.floor((value % 3600) / 60);
            const seconds = Math.floor(value % 60);
            const pad = (n: number) => String(n).padStart(2, '0');
            return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
          }
          
        }
      }
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: (tooltipItem: any) => {
            const totalSeconds = tooltipItem.raw;
            const hours = Math.floor(totalSeconds / 3600);
            const minutes = Math.floor((totalSeconds % 3600) / 60);
            const seconds = totalSeconds % 60;
            const pad = (n: number) => String(n).padStart(2, '0');
            return `Durée: ${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
          }
        }
      }
    }
  };
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['chartusers'] && this.chartusers?.history) {
      const jours: Jour[] = this.chartusers.history;
    ;
       
      this.barChartLabels = jours.map(
        (j: Jour) => `${j.day} ${this.formatDate(j.date)}`
      );
      
      this.totalHoursRaw = jours.map((j: Jour) => j.total_hours || '00:00:00');
      const data = this.totalHoursRaw.map(h => this.convertToSeconds(h));

      this.barChartData = {
        labels: this.barChartLabels,
        datasets: [
          {
            data: data,
            label: 'Heures travaillées',
            backgroundColor: 'rgba(83 , 88 , 217, 0.5)',
            borderColor: 'rgba(83, 88, 217, 1)',
            borderWidth: 1
          }
        ]
      };
    }
  }
  private convertToSeconds(timeStr: string): number {
    if (!timeStr || timeStr === '00:00:00') return 0;
    const [h, m, s] = timeStr.split(':').map(Number);
    return h * 3600 + m * 60 + s;
  }
  

  private formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    return `${day}-${month}`;
  }
}
