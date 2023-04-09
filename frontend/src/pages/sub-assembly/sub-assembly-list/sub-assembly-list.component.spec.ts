import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubAssemblyListComponent } from './sub-assembly-list.component';

describe('SubAssemblyListComponent', () => {
  let component: SubAssemblyListComponent;
  let fixture: ComponentFixture<SubAssemblyListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubAssemblyListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubAssemblyListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
