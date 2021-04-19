import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TarjetaJustificacionFichaActComponent } from './tarjeta-justificacion-ficha-act.component';

describe('TarjetaJustificacionFichaActComponent', () => {
  let component: TarjetaJustificacionFichaActComponent;
  let fixture: ComponentFixture<TarjetaJustificacionFichaActComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TarjetaJustificacionFichaActComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TarjetaJustificacionFichaActComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
