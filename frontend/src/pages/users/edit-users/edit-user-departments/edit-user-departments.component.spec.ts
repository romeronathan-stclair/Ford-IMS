import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditUserDepartmentsComponent } from './edit-user-departments.component';

describe('EditUserDepartmentsComponent', () => {
  let component: EditUserDepartmentsComponent;
  let fixture: ComponentFixture<EditUserDepartmentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditUserDepartmentsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditUserDepartmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
