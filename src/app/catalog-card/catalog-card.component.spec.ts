import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogCardComponent } from './catalog-card.component';

describe('CatalogCardComponent', () => {
  let component: CatalogCardComponent;
  let fixture: ComponentFixture<CatalogCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CatalogCardComponent]
    });
    fixture = TestBed.createComponent(CatalogCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
