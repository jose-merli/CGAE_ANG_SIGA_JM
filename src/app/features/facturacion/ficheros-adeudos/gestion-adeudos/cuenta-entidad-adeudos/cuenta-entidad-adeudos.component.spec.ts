import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CuentaEntidadAdeudosComponent } from './cuenta-entidad-adeudos.component';

describe('CuentaEntidadAdeudosComponent', () => {
  let component: CuentaEntidadAdeudosComponent;
  let fixture: ComponentFixture<CuentaEntidadAdeudosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CuentaEntidadAdeudosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CuentaEntidadAdeudosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
