import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditProductInformationComponent } from './edit-product-information.component';

describe('EditProductInformationComponent', () => {
  let component: EditProductInformationComponent;
  let fixture: ComponentFixture<EditProductInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditProductInformationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditProductInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
