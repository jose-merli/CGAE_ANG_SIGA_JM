import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatosColaGuardiaComponent } from './datos-cola-guardia.component';

describe('DatosColaGuardiaComponent', () => {
  let component: DatosColaGuardiaComponent;
  let fixture: ComponentFixture<DatosColaGuardiaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatosColaGuardiaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatosColaGuardiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
