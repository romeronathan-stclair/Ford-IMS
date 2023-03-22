import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductionCountComponent } from './production-count.component';

describe('ProductionCountComponent', () => {
  let component: ProductionCountComponent;
  let fixture: ComponentFixture<ProductionCountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductionCountComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductionCountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
