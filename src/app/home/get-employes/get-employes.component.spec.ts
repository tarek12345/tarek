import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetEmployesComponent } from './get-employes.component';

describe('GetEmployesComponent', () => {
  let component: GetEmployesComponent;
  let fixture: ComponentFixture<GetEmployesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GetEmployesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GetEmployesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
