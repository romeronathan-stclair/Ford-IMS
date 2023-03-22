import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductionCountCreateComponent } from './production-count-create.component';

describe('ProductionCountCreateComponent', () => {
  let component: ProductionCountCreateComponent;
  let fixture: ComponentFixture<ProductionCountCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductionCountCreateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductionCountCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
