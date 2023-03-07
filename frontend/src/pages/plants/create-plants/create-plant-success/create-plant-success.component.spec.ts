import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePlantSuccessComponent } from './create-plant-success.component';

describe('CreatePlantSuccessComponent', () => {
  let component: CreatePlantSuccessComponent;
  let fixture: ComponentFixture<CreatePlantSuccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreatePlantSuccessComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreatePlantSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
