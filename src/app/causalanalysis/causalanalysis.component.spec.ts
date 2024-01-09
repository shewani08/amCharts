import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CausalanalysisComponent } from './causalanalysis.component';

describe('CausalanalysisComponent', () => {
  let component: CausalanalysisComponent;
  let fixture: ComponentFixture<CausalanalysisComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CausalanalysisComponent]
    });
    fixture = TestBed.createComponent(CausalanalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
