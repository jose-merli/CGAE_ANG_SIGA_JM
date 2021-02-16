import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TarjetaExpedientesEconomicosComponent } from './tarjeta-expedientes-economicos.component';

describe('TarjetaExpedientesEconomicosComponent', () => {
  let component: TarjetaExpedientesEconomicosComponent;
  let fixture: ComponentFixture<TarjetaExpedientesEconomicosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TarjetaExpedientesEconomicosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TarjetaExpedientesEconomicosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
