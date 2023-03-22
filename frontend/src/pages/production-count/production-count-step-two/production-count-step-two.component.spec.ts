import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductionCountStepTwoComponent } from './production-count-step-two.component';

describe('ProductionCountStepTwoComponent', () => {
  let component: ProductionCountStepTwoComponent;
  let fixture: ComponentFixture<ProductionCountStepTwoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductionCountStepTwoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductionCountStepTwoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
