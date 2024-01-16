import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CausalAnalysisComponent } from './causalanalysis.component';

describe('CausalAnalysisComponent', () => {
  let component: CausalAnalysisComponent;
  let fixture: ComponentFixture<CausalAnalysisComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CausalAnalysisComponent]
    });
    fixture = TestBed.createComponent(CausalAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
