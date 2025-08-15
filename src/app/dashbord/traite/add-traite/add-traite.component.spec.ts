import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTraiteComponent } from './add-traite.component';

describe('AddTraiteComponent', () => {
  let component: AddTraiteComponent;
  let fixture: ComponentFixture<AddTraiteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddTraiteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddTraiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
