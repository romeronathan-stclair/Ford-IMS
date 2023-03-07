import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignDepartmentsDialogComponent } from './assign-departments-dialog.component';

describe('AssignDepartmentsDialogComponent', () => {
  let component: AssignDepartmentsDialogComponent;
  let fixture: ComponentFixture<AssignDepartmentsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignDepartmentsDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignDepartmentsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
