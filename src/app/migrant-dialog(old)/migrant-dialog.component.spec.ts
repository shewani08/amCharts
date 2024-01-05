import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MigrantDialogComponent } from './migrant-dialog.component';

describe('MigrantDialogComponent', () => {
  let component: MigrantDialogComponent;
  let fixture: ComponentFixture<MigrantDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MigrantDialogComponent]
    });
    fixture = TestBed.createComponent(MigrantDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
