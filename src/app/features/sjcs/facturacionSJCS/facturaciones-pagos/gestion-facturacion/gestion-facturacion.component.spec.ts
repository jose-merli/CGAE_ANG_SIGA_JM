import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionFacturacionComponent } from './gestion-facturacion.component';

describe('GestionFacturacionComponent', () => {
  let component: GestionFacturacionComponent;
  let fixture: ComponentFixture<GestionFacturacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GestionFacturacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionFacturacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
