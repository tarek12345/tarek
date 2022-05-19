import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'wallpost-dashboard-angular';

  isMobile: boolean = false;
  isMobileSmall : boolean = false;
   width:number = window.innerWidth;
  largeWidth:number  = 1920;
   SmallWidth:number  = 1024;
     onWindowResize(event) {
    
  this.width = event.target.innerWidth;
  this.isMobile = this.width < this.largeWidth;
 this.isMobileSmall = this.width < this.SmallWidth;
}
onActivate(event) {
  let scrollToTop = window.setInterval(() => {
      let pos = window.pageYOffset;
      if (pos > 0) {
          window.scrollTo(0, pos - 20); // how far to scroll on each step
      } else {
          window.clearInterval(scrollToTop);
      }
  }, 16);
}
}
