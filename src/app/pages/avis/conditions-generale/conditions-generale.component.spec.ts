import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConditionsGeneraleComponent } from './conditions-generale.component';

describe('ConditionsGeneraleComponent', () => {
  let component: ConditionsGeneraleComponent;
  let fixture: ComponentFixture<ConditionsGeneraleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConditionsGeneraleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConditionsGeneraleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
