import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinerepComponent } from './linerep.component';

describe('LinerepComponent', () => {
  let component: LinerepComponent;
  let fixture: ComponentFixture<LinerepComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LinerepComponent]
    });
    fixture = TestBed.createComponent(LinerepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
