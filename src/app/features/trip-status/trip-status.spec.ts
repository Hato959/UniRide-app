import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TripStatusComponent } from './trip-status';

describe('TripStatus', () => {
  let component: TripStatusComponent;
  let fixture: ComponentFixture<TripStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TripStatusComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TripStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
