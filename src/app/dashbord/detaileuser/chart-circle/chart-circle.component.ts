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
    // console.log('chartusers reçu :', this.chartusers); // 👈 Ajout ici
  
    const history = this.chartusers?.user?.history || this.chartusers?.history || [];
    const workedDays = history.length;
    const remainingDays = Math.max(this.totalTargetDays - workedDays, 0);
  
    this.totaldayWorked = workedDays;
  
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
  
  ngAfterViewInit(): void {
    if (this.chart) this.chart.update();
  }
}
