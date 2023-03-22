import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductionCountListComponent } from './production-count-list.component';

describe('ProductionCountListComponent', () => {
  let component: ProductionCountListComponent;
  let fixture: ComponentFixture<ProductionCountListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductionCountListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductionCountListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
