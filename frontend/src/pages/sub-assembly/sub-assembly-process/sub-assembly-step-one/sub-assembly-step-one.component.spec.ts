import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubAssemblyStepOneComponent } from './sub-assembly-step-one.component';

describe('SubAssemblyStepOneComponent', () => {
  let component: SubAssemblyStepOneComponent;
  let fixture: ComponentFixture<SubAssemblyStepOneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubAssemblyStepOneComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubAssemblyStepOneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
