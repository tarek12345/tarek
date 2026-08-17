import { Directive, ElementRef, Input, OnChanges } from '@angular/core';

@Directive({
  selector: '[appCounter]',
  standalone :false
})

export class CounterDirective implements OnChanges {

  @Input() appCounter: number = 0;

  constructor(private el: ElementRef) {}

  ngOnChanges(): void {
    this.animateCounter(this.appCounter);
  }

  private animateCounter(target: number): void {
    let current = 0;
    const duration = 1000;
    const startTime = performance.now();

    const update = (currentTime: number) => {
      const progress = Math.min((currentTime - startTime) / duration, 1);

      current = Math.floor(progress * target);
      this.el.nativeElement.textContent = current;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        this.el.nativeElement.textContent = target;
      }
    };

    requestAnimationFrame(update);
  }
}