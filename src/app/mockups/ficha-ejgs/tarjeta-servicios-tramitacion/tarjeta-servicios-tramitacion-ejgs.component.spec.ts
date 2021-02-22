import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TarjetaServiciosTramitacionEjgsComponent } from './tarjeta-servicios-tramitacion-ejgs.component';

describe('TarjetaServiciosTramitacionEjgsComponent', () => {
  let component: TarjetaServiciosTramitacionEjgsComponent;
  let fixture: ComponentFixture<TarjetaServiciosTramitacionEjgsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TarjetaServiciosTramitacionEjgsComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TarjetaServiciosTramitacionEjgsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
