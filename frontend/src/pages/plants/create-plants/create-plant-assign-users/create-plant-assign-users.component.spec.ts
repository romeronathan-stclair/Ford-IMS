import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePlantAssignUsersComponent } from './create-plant-assign-users.component';

describe('CreatePlantAssignUsersComponent', () => {
  let component: CreatePlantAssignUsersComponent;
  let fixture: ComponentFixture<CreatePlantAssignUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreatePlantAssignUsersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreatePlantAssignUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
