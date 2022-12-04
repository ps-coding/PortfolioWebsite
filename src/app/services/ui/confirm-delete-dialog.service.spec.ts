import { TestBed } from '@angular/core/testing';

import { ConfirmDeleteDialogService } from './confirm-delete-dialog.service';

describe('ConfirmDeleteDialogService', () => {
  let service: ConfirmDeleteDialogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConfirmDeleteDialogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
