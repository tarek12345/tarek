import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaixComponent } from './paix.component';

describe('PaixComponent', () => {
  let component: PaixComponent;
  let fixture: ComponentFixture<PaixComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PaixComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaixComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
