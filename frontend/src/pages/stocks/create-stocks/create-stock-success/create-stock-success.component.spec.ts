import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateStockSuccessComponent } from './create-stock-success.component';

describe('CreateStockSuccessComponent', () => {
  let component: CreateStockSuccessComponent;
  let fixture: ComponentFixture<CreateStockSuccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateStockSuccessComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateStockSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
