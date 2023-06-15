import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DestinatariosRetencionesClassiqueComponent } from './destinatarios-retenciones.component';

describe('DestinatariosRetencionesClassiqueComponent', () => {
  let component: DestinatariosRetencionesClassiqueComponent;
  let fixture: ComponentFixture<DestinatariosRetencionesClassiqueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DestinatariosRetencionesClassiqueComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DestinatariosRetencionesClassiqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
