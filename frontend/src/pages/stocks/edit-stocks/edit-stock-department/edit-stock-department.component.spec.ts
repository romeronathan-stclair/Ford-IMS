import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditStockDepartmentComponent } from './edit-stock-department.component';

describe('EditStockDepartmentComponent', () => {
  let component: EditStockDepartmentComponent;
  let fixture: ComponentFixture<EditStockDepartmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditStockDepartmentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditStockDepartmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
