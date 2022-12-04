import { TestBed } from '@angular/core/testing';

import { AboutContentService } from './about-content.service';

describe('AboutContentService', () => {
  let service: AboutContentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AboutContentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
