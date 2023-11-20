import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AfricamapComponent } from './africamap.component';

describe('AfricamapComponent', () => {
  let component: AfricamapComponent;
  let fixture: ComponentFixture<AfricamapComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AfricamapComponent]
    });
    fixture = TestBed.createComponent(AfricamapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
