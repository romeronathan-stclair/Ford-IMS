import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateProductStepTwoComponent } from './create-product-step-two.component';

describe('CreateProductStepTwoComponent', () => {
  let component: CreateProductStepTwoComponent;
  let fixture: ComponentFixture<CreateProductStepTwoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateProductStepTwoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateProductStepTwoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
