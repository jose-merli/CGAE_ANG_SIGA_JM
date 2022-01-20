import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TarjetaFiltroMonederosComponent } from './tarjeta-filtro-monederos.component';

describe('TarjetaFiltroMonederosComponent', () => {
  let component: TarjetaFiltroMonederosComponent;
  let fixture: ComponentFixture<TarjetaFiltroMonederosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TarjetaFiltroMonederosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TarjetaFiltroMonederosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
