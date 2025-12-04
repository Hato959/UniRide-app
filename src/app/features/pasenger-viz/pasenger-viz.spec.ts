import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasengerViz } from './pasenger-viz';

describe('PasengerViz', () => {
  let component: PasengerViz;
  let fixture: ComponentFixture<PasengerViz>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PasengerViz]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PasengerViz);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
