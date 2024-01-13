import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Card2TestingComponent } from './card2-testing.component';

describe('Card2TestingComponent', () => {
  let component: Card2TestingComponent;
  let fixture: ComponentFixture<Card2TestingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Card2TestingComponent]
    });
    fixture = TestBed.createComponent(Card2TestingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
