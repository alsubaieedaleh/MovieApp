import { TestBed } from '@angular/core/testing';

import { MoviesRecommendationService } from './movies-recommendation.service';

describe('MoviesRecommendationService', () => {
  let service: MoviesRecommendationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MoviesRecommendationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
