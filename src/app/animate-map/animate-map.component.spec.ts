import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnimateMapComponent } from './animate-map.component';

describe('AnimateMapComponent', () => {
  let component: AnimateMapComponent;
  let fixture: ComponentFixture<AnimateMapComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AnimateMapComponent]
    });
    fixture = TestBed.createComponent(AnimateMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
