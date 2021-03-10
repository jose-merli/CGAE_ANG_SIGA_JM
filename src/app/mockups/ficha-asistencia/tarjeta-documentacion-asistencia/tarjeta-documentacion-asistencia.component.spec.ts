import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TarjetaDocumentacionAsistenciaComponent } from './tarjeta-documentacion-asistencia.component';

describe('TarjetaDocumentacionAsistenciaComponent', () => {
  let component: TarjetaDocumentacionAsistenciaComponent;
  let fixture: ComponentFixture<TarjetaDocumentacionAsistenciaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TarjetaDocumentacionAsistenciaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TarjetaDocumentacionAsistenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
