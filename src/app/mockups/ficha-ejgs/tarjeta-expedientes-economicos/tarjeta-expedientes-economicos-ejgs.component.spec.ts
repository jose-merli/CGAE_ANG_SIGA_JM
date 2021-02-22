import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TarjetaExpedientesEconomicosEjgsComponent } from './tarjeta-expedientes-economicos-ejgs.component';

describe('TarjetaExpedientesEconomicosEjgsComponent', () => {
  let component: TarjetaExpedientesEconomicosEjgsComponent;
  let fixture: ComponentFixture<TarjetaExpedientesEconomicosEjgsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TarjetaExpedientesEconomicosEjgsComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TarjetaExpedientesEconomicosEjgsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
