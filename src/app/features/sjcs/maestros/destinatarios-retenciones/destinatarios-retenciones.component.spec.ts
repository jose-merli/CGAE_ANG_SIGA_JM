import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DestinatariosRetencionesComponent } from './destinatarios-retenciones.component';

describe('DestinatariosRetencionesComponent', () => {
  let component: DestinatariosRetencionesComponent;
  let fixture: ComponentFixture<DestinatariosRetencionesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DestinatariosRetencionesComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DestinatariosRetencionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
