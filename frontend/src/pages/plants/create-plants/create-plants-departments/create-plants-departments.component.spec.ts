import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePlantsDepartmentsComponent } from './create-plants-departments.component';

describe('CreatePlantsDepartmentsComponent', () => {
  let component: CreatePlantsDepartmentsComponent;
  let fixture: ComponentFixture<CreatePlantsDepartmentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreatePlantsDepartmentsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreatePlantsDepartmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
