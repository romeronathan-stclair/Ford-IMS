import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReassignStockComponent } from './reassign-stock.component';

describe('ReassignStockComponent', () => {
  let component: ReassignStockComponent;
  let fixture: ComponentFixture<ReassignStockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReassignStockComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReassignStockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
