import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateDunnageComponent } from './create-dunnage.component';

describe('CreateDunnageComponent', () => {
  let component: CreateDunnageComponent;
  let fixture: ComponentFixture<CreateDunnageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateDunnageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateDunnageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
