import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditUserPlantsComponent } from './edit-user-plants.component';

describe('EditUserPlantsComponent', () => {
  let component: EditUserPlantsComponent;
  let fixture: ComponentFixture<EditUserPlantsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditUserPlantsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditUserPlantsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
