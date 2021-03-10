import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EjgComponent } from './ejg.component';

describe('EjgComponent', () => {
  let component: EjgComponent;
  let fixture: ComponentFixture<EjgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EjgComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EjgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
