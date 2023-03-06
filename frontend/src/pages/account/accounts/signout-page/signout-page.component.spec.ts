import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignoutPageComponent } from './signout-page.component';

describe('SignoutPageComponent', () => {
  let component: SignoutPageComponent;
  let fixture: ComponentFixture<SignoutPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SignoutPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SignoutPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
