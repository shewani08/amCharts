import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionMapComponent } from './collection-map.component';

describe('CollectionMapComponent', () => {
  let component: CollectionMapComponent;
  let fixture: ComponentFixture<CollectionMapComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CollectionMapComponent]
    });
    fixture = TestBed.createComponent(CollectionMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
