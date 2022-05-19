import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidbarPhotosComponent } from './sidbar-photos.component';

describe('SidbarPhotosComponent', () => {
  let component: SidbarPhotosComponent;
  let fixture: ComponentFixture<SidbarPhotosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SidbarPhotosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SidbarPhotosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
