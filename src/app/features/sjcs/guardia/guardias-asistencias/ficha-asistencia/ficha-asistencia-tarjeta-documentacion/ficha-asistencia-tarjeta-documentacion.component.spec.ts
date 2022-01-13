import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FichaAsistenciaTarjetaDocumentacionComponent } from './ficha-asistencia-tarjeta-documentacion.component';

describe('FichaAsistenciaTarjetaDocumentacionComponent', () => {
  let component: FichaAsistenciaTarjetaDocumentacionComponent;
  let fixture: ComponentFixture<FichaAsistenciaTarjetaDocumentacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FichaAsistenciaTarjetaDocumentacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FichaAsistenciaTarjetaDocumentacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
