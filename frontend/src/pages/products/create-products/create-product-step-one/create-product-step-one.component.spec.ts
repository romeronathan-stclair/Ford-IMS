import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateProductStepOneComponent } from './create-product-step-one.component';

describe('CreateProductStepOneComponent', () => {
  let component: CreateProductStepOneComponent;
  let fixture: ComponentFixture<CreateProductStepOneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateProductStepOneComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateProductStepOneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
