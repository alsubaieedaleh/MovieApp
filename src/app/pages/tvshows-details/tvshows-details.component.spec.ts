import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TVShowsDetailsComponent } from './tvshows-details.component';

describe('TVShowsDetailsComponent', () => {
  let component: TVShowsDetailsComponent;
  let fixture: ComponentFixture<TVShowsDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TVShowsDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TVShowsDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
