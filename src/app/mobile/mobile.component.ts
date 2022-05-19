import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-mobile',
  templateUrl: './mobile.component.html',
  styleUrls: ['./mobile.component.css']
})
export class MobileComponent implements OnInit {

  constructor() { }
  isMobile: boolean = false;
  isMobileSmall : boolean = false;
  width:number = window.innerWidth;
  largeWidth:number  = 1920;
  SmallWidth:number  = 1024;
  ngOnInit(): void {
    this.isMobile = this.width < this.largeWidth;
    this.isMobileSmall = this.width < this.SmallWidth
  }
  onWindowResize(event) {
    this.width = event.target.innerWidth;
    this.isMobile = this.width < this.largeWidth;
    this.isMobileSmall = this.width < this.SmallWidth;
}
}
