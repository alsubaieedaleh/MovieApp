import { TestBed } from '@angular/core/testing';

import { TVShowsDetailsService } from './tvshows-details.service';

describe('TVShowsDetailsService', () => {
  let service: TVShowsDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TVShowsDetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
