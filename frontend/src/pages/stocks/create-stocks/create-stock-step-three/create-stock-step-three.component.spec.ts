import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateStockStepThreeComponent } from './create-stock-step-three.component';

describe('CreateStockStepThreeComponent', () => {
  let component: CreateStockStepThreeComponent;
  let fixture: ComponentFixture<CreateStockStepThreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateStockStepThreeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateStockStepThreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
