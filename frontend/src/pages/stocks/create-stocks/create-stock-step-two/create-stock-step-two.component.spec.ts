import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateStockStepTwoComponent } from './create-stock-step-two.component';

describe('CreateStockStepTwoComponent', () => {
  let component: CreateStockStepTwoComponent;
  let fixture: ComponentFixture<CreateStockStepTwoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateStockStepTwoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateStockStepTwoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
