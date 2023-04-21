import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubAssemblyRouterComponent } from './sub-assembly-router.component';

describe('SubAssemblyRouterComponent', () => {
  let component: SubAssemblyRouterComponent;
  let fixture: ComponentFixture<SubAssemblyRouterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubAssemblyRouterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubAssemblyRouterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
