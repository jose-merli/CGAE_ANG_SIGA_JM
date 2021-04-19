import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TarjetaHistoricoFichaActComponent } from './tarjeta-historico-ficha-act.component';

describe('TarjetaHistoricoFichaActComponent', () => {
  let component: TarjetaHistoricoFichaActComponent;
  let fixture: ComponentFixture<TarjetaHistoricoFichaActComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TarjetaHistoricoFichaActComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TarjetaHistoricoFichaActComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
