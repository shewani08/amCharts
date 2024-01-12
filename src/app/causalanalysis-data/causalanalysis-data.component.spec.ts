import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CausalanalysisDataComponent } from './causalanalysis-data.component';

describe('CausalanalysisDataComponent', () => {
  let component: CausalanalysisDataComponent;
  let fixture: ComponentFixture<CausalanalysisDataComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CausalanalysisDataComponent]
    });
    fixture = TestBed.createComponent(CausalanalysisDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
