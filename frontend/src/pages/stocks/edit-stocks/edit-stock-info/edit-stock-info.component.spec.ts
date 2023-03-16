import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditStockInfoComponent } from './edit-stock-info.component';

describe('EditStockInfoComponent', () => {
  let component: EditStockInfoComponent;
  let fixture: ComponentFixture<EditStockInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditStockInfoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditStockInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
