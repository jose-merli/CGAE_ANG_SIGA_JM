import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TarjetaServiciosTramitacionComponent } from './tarjeta-servicios-tramitacion.component';

describe('TarjetaServiciosTramitacionComponent', () => {
  let component: TarjetaServiciosTramitacionComponent;
  let fixture: ComponentFixture<TarjetaServiciosTramitacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TarjetaServiciosTramitacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TarjetaServiciosTramitacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
