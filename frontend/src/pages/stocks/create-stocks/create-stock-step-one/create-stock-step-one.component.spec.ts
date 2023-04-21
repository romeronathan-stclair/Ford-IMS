import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateStockStepOneComponent } from './create-stock-step-one.component';

describe('CreateStockStepOneComponent', () => {
  let component: CreateStockStepOneComponent;
  let fixture: ComponentFixture<CreateStockStepOneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateStockStepOneComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateStockStepOneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
