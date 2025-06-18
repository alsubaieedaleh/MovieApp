import { TestBed } from '@angular/core/testing';

import { MoveieReviewsService } from './moveie-reviews.service';

describe('MoveieReviewsService', () => {
  let service: MoveieReviewsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MoveieReviewsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
