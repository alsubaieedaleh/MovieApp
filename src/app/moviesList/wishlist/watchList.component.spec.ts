import { ComponentFixture, TestBed } from '@angular/core/testing';

import { watchListComponent } from './watchList.component';

describe('watchListComponent', () => {
  let component: watchListComponent;
  let fixture: ComponentFixture<watchListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [watchListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(watchListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
