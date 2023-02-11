import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionCuentasBancariasClassiqueComponent } from './gestion-cuentas-bancarias.component';

describe('GestionCuentasBancariasClassiqueComponent', () => {
  let component: GestionCuentasBancariasClassiqueComponent;
  let fixture: ComponentFixture<GestionCuentasBancariasClassiqueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GestionCuentasBancariasClassiqueComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionCuentasBancariasClassiqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
