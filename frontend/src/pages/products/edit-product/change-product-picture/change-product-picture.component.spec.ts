import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeProductPictureComponent } from './change-product-picture.component';

describe('ChangeProductPictureComponent', () => {
  let component: ChangeProductPictureComponent;
  let fixture: ComponentFixture<ChangeProductPictureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangeProductPictureComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChangeProductPictureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
