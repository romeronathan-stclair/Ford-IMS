import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FordContainerComponent } from './ford-container.component';

describe('FordContainerComponent', () => {
  let component: FordContainerComponent;
  let fixture: ComponentFixture<FordContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FordContainerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FordContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
