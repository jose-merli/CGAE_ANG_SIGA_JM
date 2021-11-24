import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TarjetaListadoPagosComponent } from './tarjeta-listado-pagos.component';

describe('TarjetaListadoPagosComponent', () => {
  let component: TarjetaListadoPagosComponent;
  let fixture: ComponentFixture<TarjetaListadoPagosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TarjetaListadoPagosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TarjetaListadoPagosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
