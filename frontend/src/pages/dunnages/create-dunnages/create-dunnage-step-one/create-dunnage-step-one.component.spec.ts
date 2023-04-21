import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateDunnageStepOneComponent } from './create-dunnage-step-one.component';

describe('CreateDunnageStepOneComponent', () => {
  let component: CreateDunnageStepOneComponent;
  let fixture: ComponentFixture<CreateDunnageStepOneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateDunnageStepOneComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateDunnageStepOneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
