import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubAssemblyComponent } from './sub-assembly.component';

describe('SubAssemblyComponent', () => {
  let component: SubAssemblyComponent;
  let fixture: ComponentFixture<SubAssemblyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubAssemblyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubAssemblyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
