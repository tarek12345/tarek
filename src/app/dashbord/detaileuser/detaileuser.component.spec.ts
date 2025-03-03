import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Detaileuser } from './detaileuser.component';

describe('StatComponent', () => {
  let component: Detaileuser;
  let fixture: ComponentFixture<Detaileuser>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Detaileuser]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Detaileuser);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
