import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TVShowsComponent } from './tvshows.component';

describe('TVShowsComponent', () => {
  let component: TVShowsComponent;
  let fixture: ComponentFixture<TVShowsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TVShowsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TVShowsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
