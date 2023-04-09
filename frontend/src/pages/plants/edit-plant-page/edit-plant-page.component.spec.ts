import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPlantPageComponent } from './edit-plant-page.component';

describe('EditPlantPageComponent', () => {
  let component: EditPlantPageComponent;
  let fixture: ComponentFixture<EditPlantPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditPlantPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditPlantPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
