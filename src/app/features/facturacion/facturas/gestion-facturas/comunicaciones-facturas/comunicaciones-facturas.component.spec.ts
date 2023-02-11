import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComunicacionesFacturasComponent } from './comunicaciones-facturas.component';

describe('ComunicacionesFacturasComponent', () => {
  let component: ComunicacionesFacturasComponent;
  let fixture: ComponentFixture<ComunicacionesFacturasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComunicacionesFacturasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComunicacionesFacturasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
