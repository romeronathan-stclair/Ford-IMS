import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateDunnageSuccessComponent } from './create-dunnage-success.component';

describe('CreateDunnageSuccessComponent', () => {
  let component: CreateDunnageSuccessComponent;
  let fixture: ComponentFixture<CreateDunnageSuccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateDunnageSuccessComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateDunnageSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
