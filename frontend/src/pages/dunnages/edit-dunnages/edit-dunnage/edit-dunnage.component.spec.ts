import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditDunnageComponent } from './edit-dunnage.component';

describe('EditDunnageComponent', () => {
  let component: EditDunnageComponent;
  let fixture: ComponentFixture<EditDunnageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditDunnageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditDunnageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
