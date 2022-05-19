import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarAvisComponent } from './sidebar-avis.component';

describe('SidebarAvisComponent', () => {
  let component: SidebarAvisComponent;
  let fixture: ComponentFixture<SidebarAvisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SidebarAvisComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SidebarAvisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
