import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditDunnageImageComponent } from './edit-dunnage-image.component';

describe('EditDunnageImageComponent', () => {
  let component: EditDunnageImageComponent;
  let fixture: ComponentFixture<EditDunnageImageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditDunnageImageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditDunnageImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
