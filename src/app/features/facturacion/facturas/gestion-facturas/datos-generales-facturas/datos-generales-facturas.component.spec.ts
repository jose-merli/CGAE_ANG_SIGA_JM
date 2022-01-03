import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatosGeneralesFacturasComponent } from './datos-generales-facturas.component';

describe('DatosGeneralesFacturasComponent', () => {
  let component: DatosGeneralesFacturasComponent;
  let fixture: ComponentFixture<DatosGeneralesFacturasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatosGeneralesFacturasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatosGeneralesFacturasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
