import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SankeyGraphComponent } from './sankey-graph.component';

describe('SankeyGraphComponent', () => {
  let component: SankeyGraphComponent;
  let fixture: ComponentFixture<SankeyGraphComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SankeyGraphComponent]
    });
    fixture = TestBed.createComponent(SankeyGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
