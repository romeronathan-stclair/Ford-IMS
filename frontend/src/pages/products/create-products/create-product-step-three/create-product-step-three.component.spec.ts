import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateProductStepThreeComponent } from './create-product-step-three.component';

describe('CreateProductStepThreeComponent', () => {
  let component: CreateProductStepThreeComponent;
  let fixture: ComponentFixture<CreateProductStepThreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateProductStepThreeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateProductStepThreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
