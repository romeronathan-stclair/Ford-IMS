import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePlantsUsersComponent } from './create-plants-users.component';

describe('CreatePlantsUsersComponent', () => {
  let component: CreatePlantsUsersComponent;
  let fixture: ComponentFixture<CreatePlantsUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreatePlantsUsersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreatePlantsUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
