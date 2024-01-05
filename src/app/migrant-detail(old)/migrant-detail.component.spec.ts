import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MigrantDetailComponent } from './migrant-detail.component';

describe('MigrantDetailComponent', () => {
  let component: MigrantDetailComponent;
  let fixture: ComponentFixture<MigrantDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MigrantDetailComponent]
    });
    fixture = TestBed.createComponent(MigrantDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
