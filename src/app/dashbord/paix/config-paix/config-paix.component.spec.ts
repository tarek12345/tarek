import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigPaixComponent } from './config-paix.component';

describe('ConfigPaixComponent', () => {
  let component: ConfigPaixComponent;
  let fixture: ComponentFixture<ConfigPaixComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConfigPaixComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfigPaixComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
