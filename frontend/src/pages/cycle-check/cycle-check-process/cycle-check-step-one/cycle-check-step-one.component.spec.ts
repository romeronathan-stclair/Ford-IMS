import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CycleCheckStepOneComponent } from './cycle-check-step-one.component';

describe('CycleCheckStepOneComponent', () => {
  let component: CycleCheckStepOneComponent;
  let fixture: ComponentFixture<CycleCheckStepOneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CycleCheckStepOneComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CycleCheckStepOneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
