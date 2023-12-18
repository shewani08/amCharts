import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FactorNodegraphComponent } from './factor-nodegraph.component';

describe('FactorNodegraphComponent', () => {
  let component: FactorNodegraphComponent;
  let fixture: ComponentFixture<FactorNodegraphComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FactorNodegraphComponent]
    });
    fixture = TestBed.createComponent(FactorNodegraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
