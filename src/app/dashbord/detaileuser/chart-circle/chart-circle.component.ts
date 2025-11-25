import { Component, Input, OnChanges, SimpleChanges, ViewChild, AfterViewInit } from '@angular/core';
import { ChartType, ChartData, ChartOptions } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-chart-circle',
  templateUrl: './chart-circle.component.html',
  styleUrls: ['./chart-circle.component.css'],
  standalone: false
})
export class ChartCircleComponent implements OnChanges, AfterViewInit {
  @Input() chartusers: any;
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  public totaldayWorked: number = 0;
  public totalTargetDays: number = 22;
  public totalHoursMonth: string = "00:00:00";
  public avgHoursPerDay: string = "00:00:00";
  public doughnutChartLabels: string[] = ['Jours travaillés', 'Jours restants'];
  public doughnutChartData: ChartData<'doughnut'> = {
    labels: this.doughnutChartLabels,
    datasets: [
      {
        data: [0, 22],
        backgroundColor: ['#5358D9', '#E0E0E0'],
        hoverBackgroundColor: ['#3F43B5', '#C0C0C0'],
        borderWidth: 1
      }
    ]
  };

  public doughnutChartType: ChartType = 'doughnut';
  public doughnutChartOptions: ChartOptions = {
    responsive: true,
    plugins: {
      tooltip: {
        callbacks: {
          label: (tooltipItem: any) => {
            const label = tooltipItem.label;
            const value = tooltipItem.raw;
            return `${label}: ${value} jour(s)`;
          }
        }
      }
    }
  };
ngOnChanges(changes: SimpleChanges): void {
  const history = this.chartusers?.user?.history || this.chartusers?.history || [];

  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  const daysThisMonth = history.filter((h: any) => {
    const d = new Date(h.date);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });

  const workedDays = daysThisMonth.length;
  const remainingDays = Math.max(this.totalTargetDays - workedDays, 0);
  this.totaldayWorked = workedDays;

  let totalSeconds = 0;
  daysThisMonth.forEach((d: any) => {
    totalSeconds += this.convertToSeconds(d.total_hours || '00:00:00');
  });

  this.totalHoursMonth = this.formatDuration(totalSeconds);

  this.avgHoursPerDay = workedDays > 0 ? this.formatDuration(Math.floor(totalSeconds / workedDays)) : "00:00:00";

  this.doughnutChartData = {
    labels: this.doughnutChartLabels,
    datasets: [
      {
        data: [workedDays, remainingDays],
        backgroundColor: ['#5358D9', '#E0E0E0'],
        hoverBackgroundColor: ['#3F43B5', '#C0C0C0'],
        borderWidth: 1
      }
    ]
  };

  if (this.chart) this.chart.update();
}
private convertToSeconds(timeStr: string): number {
  if (!timeStr || timeStr === '00:00:00') return 0;
  const [h, m, s] = timeStr.split(':').map(Number);
  return h * 3600 + m * 60 + s;
}
private formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(hours)}:${pad(minutes)}:${pad(secs)}`;
}  
  ngAfterViewInit(): void {
    if (this.chart) this.chart.update();
  }
}
