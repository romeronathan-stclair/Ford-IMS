import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditDunnageRouterComponent } from './edit-dunnage-router.component';

describe('EditDunnageRouterComponent', () => {
  let component: EditDunnageRouterComponent;
  let fixture: ComponentFixture<EditDunnageRouterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditDunnageRouterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditDunnageRouterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
