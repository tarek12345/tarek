import { Component, Input } from '@angular/core';
import { ChartOptions, ChartData, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css'],
  standalone : false
})
export class ChartComponent {
  @Input() itemuser: any;
  ngOnInit(): void {
    
    console.log(this.itemuser);
  }
  public barChartOptions: ChartOptions = {
    responsive: true,
    scales: {
      x: { 
        title: {
          display: true,
          text: 'Jours'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Nombre heurs'
        },
        beginAtZero: true
      }
    }
  };
  
  // Utilisez directement un tableau de chaînes de caractères pour les labels
  public barChartLabels: string[] = ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'];
  
  public barChartData: ChartData<'bar'> = {
    labels: this.barChartLabels,
    datasets: [
      {
        data: [12, 19, 3, 5, 2, 3],
        label: 'Number of Votes',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
      }
    ]
  };

  public barChartType: ChartType = 'bar';
}