import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimezonemapComponent } from './timezonemap.component';

describe('TimezonemapComponent', () => {
  let component: TimezonemapComponent;
  let fixture: ComponentFixture<TimezonemapComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TimezonemapComponent]
    });
    fixture = TestBed.createComponent(TimezonemapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
