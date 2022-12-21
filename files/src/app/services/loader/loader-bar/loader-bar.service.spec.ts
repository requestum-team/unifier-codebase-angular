import { TestBed } from '@angular/core/testing';

import { LoaderBarService } from './loader-bar.service';

describe('LoaderBarService', () => {
  let service: LoaderBarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoaderBarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
