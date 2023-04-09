import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DunnagesComponent } from './dunnages.component';

describe('DunnagesComponent', () => {
  let component: DunnagesComponent;
  let fixture: ComponentFixture<DunnagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DunnagesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DunnagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
