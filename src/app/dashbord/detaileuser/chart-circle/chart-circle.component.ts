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

  public totalSecondsWorked: number = 0;
  public totaldayWorked: number = 0;
  public targetSeconds: number = 22 * 7.25 * 3600; // 22 jours × 7h15

  public doughnutChartLabels: string[] = ['Jours travaillés', 'Jours restants'];
  public doughnutChartData: ChartData<'doughnut'> = {
    labels: this.doughnutChartLabels,
    datasets: [
      {
        data: [0, 0],
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
    if (changes['chartusers']) {
      const workedDays = this.chartusers?.user?.history?.length || 0;
      const remainingDays = Math.max(22 - workedDays, 0);

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

      // Calcul du total des heures travaillées en secondes
      if (this.chartusers?.user?.history) {
        const totalSeconds = remainingDays
    
        this.totalSecondsWorked = totalSeconds;
        this.totaldayWorked = workedDays
      } else {
        this.totalSecondsWorked = 0;
      }

      // Mise à jour du chart
      if (this.chart) {
        this.chart.update();
      }
    }
  }

  ngAfterViewInit(): void {
    if (this.chart) {
      this.chart.update();
    }
  }

  private convertToSeconds(timeStr: string): number {
    if (!timeStr || timeStr === '00:00:00') return 0;
    const [h, m, s] = timeStr.split(':').map(Number);
    return h * 3600 + m * 60 + s;
  }
}
