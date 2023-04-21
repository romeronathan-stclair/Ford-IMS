import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductionCountStepOneComponent } from './production-count-step-one.component';

describe('ProductionCountStepOneComponent', () => {
  let component: ProductionCountStepOneComponent;
  let fixture: ComponentFixture<ProductionCountStepOneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductionCountStepOneComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductionCountStepOneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
