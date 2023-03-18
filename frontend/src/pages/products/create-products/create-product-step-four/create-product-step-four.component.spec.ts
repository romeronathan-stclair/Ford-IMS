import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateProductStepFourComponent } from './create-product-step-four.component';

describe('CreateProductStepFourComponent', () => {
  let component: CreateProductStepFourComponent;
  let fixture: ComponentFixture<CreateProductStepFourComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateProductStepFourComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateProductStepFourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
