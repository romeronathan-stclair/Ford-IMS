import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateDunnageStepTwoComponent } from './create-dunnage-step-two.component';

describe('CreateDunnageStepTwoComponent', () => {
  let component: CreateDunnageStepTwoComponent;
  let fixture: ComponentFixture<CreateDunnageStepTwoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateDunnageStepTwoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateDunnageStepTwoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
