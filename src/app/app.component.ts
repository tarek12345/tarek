import { Component ,HostListener } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'pointingworks';
    isMobile = false;

  ngOnInit() {
    this.checkDevice();
  }

  @HostListener('window:resize')
  onResize() {
    this.checkDevice();
  }

  checkDevice() {
    this.isMobile = window.innerWidth <= 768; // tu peux ajuster ce seuil si besoin
  }
}
