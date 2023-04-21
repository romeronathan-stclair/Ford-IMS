import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePlantStepOneComponent } from './create-plant-step-one.component';

describe('CreatePlantStepOneComponent', () => {
  let component: CreatePlantStepOneComponent;
  let fixture: ComponentFixture<CreatePlantStepOneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreatePlantStepOneComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreatePlantStepOneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
