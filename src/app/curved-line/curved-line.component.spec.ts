import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurvedLineComponent } from './curved-line.component';

describe('CurvedLineComponent', () => {
  let component: CurvedLineComponent;
  let fixture: ComponentFixture<CurvedLineComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CurvedLineComponent]
    });
    fixture = TestBed.createComponent(CurvedLineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
