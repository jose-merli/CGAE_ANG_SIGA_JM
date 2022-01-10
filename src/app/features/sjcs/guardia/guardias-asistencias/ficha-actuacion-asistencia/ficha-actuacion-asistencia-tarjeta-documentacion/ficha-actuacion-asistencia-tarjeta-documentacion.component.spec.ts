import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FichaActuacionAsistenciaTarjetaDocumentacionComponent } from './ficha-actuacion-asistencia-tarjeta-documentacion.component';

describe('FichaActuacionAsistenciaTarjetaDocumentacionComponent', () => {
  let component: FichaActuacionAsistenciaTarjetaDocumentacionComponent;
  let fixture: ComponentFixture<FichaActuacionAsistenciaTarjetaDocumentacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FichaActuacionAsistenciaTarjetaDocumentacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FichaActuacionAsistenciaTarjetaDocumentacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
