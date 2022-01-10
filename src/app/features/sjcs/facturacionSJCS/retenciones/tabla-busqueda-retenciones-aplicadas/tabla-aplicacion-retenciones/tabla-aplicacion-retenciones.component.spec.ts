import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaAplicacionRetencionesComponent } from './tabla-aplicacion-retenciones.component';

describe('TablaAplicacionRetencionesComponent', () => {
  let component: TablaAplicacionRetencionesComponent;
  let fixture: ComponentFixture<TablaAplicacionRetencionesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TablaAplicacionRetencionesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TablaAplicacionRetencionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
