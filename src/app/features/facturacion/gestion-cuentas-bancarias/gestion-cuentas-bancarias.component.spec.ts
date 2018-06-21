import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionCuentasBancariasComponent } from './gestion-cuentas-bancarias.component';

describe('GestionCuentasBancariasComponent', () => {
  let component: GestionCuentasBancariasComponent;
  let fixture: ComponentFixture<GestionCuentasBancariasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GestionCuentasBancariasComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionCuentasBancariasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
