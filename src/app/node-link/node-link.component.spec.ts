import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NodeLinkComponent } from './node-link.component';

describe('NodeLinkComponent', () => {
  let component: NodeLinkComponent;
  let fixture: ComponentFixture<NodeLinkComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NodeLinkComponent]
    });
    fixture = TestBed.createComponent(NodeLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
