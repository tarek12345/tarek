import { Component, Input, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-statistique',
  standalone: false,
  
  templateUrl: './statistique.component.html',
  styleUrl: './statistique.component.css'
})
export class StatistiqueComponent {
  @Input() userdetaile: any;
      // Déclaration du graphique
  constructor(
    ) {
      
    }

      ngOnChanges(changes: SimpleChanges): void {
        if (changes['userdetaile'] && this.userdetaile) {
          console.log("chatuserschatusers",changes);
          
        }
      }
  ngOnInit(): void {

  
  }
  
}
