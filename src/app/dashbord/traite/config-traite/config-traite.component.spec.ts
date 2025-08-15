import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigTraiteComponent } from './config-traite.component';

describe('ConfigTraiteComponent', () => {
  let component: ConfigTraiteComponent;
  let fixture: ComponentFixture<ConfigTraiteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConfigTraiteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfigTraiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
