import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatosGeneracionFichTransferenciasComponent } from './datos-generacion-fich-transferencias.component';

describe('DatosGeneracionFichTransferenciasComponent', () => {
  let component: DatosGeneracionFichTransferenciasComponent;
  let fixture: ComponentFixture<DatosGeneracionFichTransferenciasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatosGeneracionFichTransferenciasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatosGeneracionFichTransferenciasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
