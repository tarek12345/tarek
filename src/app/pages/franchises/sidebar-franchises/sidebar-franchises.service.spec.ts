import { TestBed } from '@angular/core/testing';

import { SidebarFranchisesService } from './sidebar-franchises.service';

describe('SidebarFranchisesService', () => {
  let service: SidebarFranchisesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SidebarFranchisesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
