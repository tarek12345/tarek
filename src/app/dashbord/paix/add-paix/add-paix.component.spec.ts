import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPaixComponent } from './add-paix.component';

describe('AddPaixComponent', () => {
  let component: AddPaixComponent;
  let fixture: ComponentFixture<AddPaixComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddPaixComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddPaixComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
