import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrashDialogComponent } from './task-dialog.component';

describe('TaskDialogComponent', () => {
  let component: TrashDialogComponent;
  let fixture: ComponentFixture<TrashDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrashDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrashDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
