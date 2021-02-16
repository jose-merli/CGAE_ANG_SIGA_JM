import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TarjetaDatosGeneralesAsistenciaComponent } from './tarjeta-datos-generales.component';

describe('TarjetaDatosGeneralesAsistenciaComponent', () => {
  let component: TarjetaDatosGeneralesAsistenciaComponent;
  let fixture: ComponentFixture<TarjetaDatosGeneralesAsistenciaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TarjetaDatosGeneralesAsistenciaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TarjetaDatosGeneralesAsistenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
