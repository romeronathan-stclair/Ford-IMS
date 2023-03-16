import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditStockImageComponent } from './edit-stock-image.component';

describe('EditStockImageComponent', () => {
  let component: EditStockImageComponent;
  let fixture: ComponentFixture<EditStockImageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditStockImageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditStockImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
