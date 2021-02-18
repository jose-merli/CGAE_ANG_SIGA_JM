import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpedientesEconomicosComponent } from './expedientes-economicos.component';

describe('ExpedientesEconomicosComponent', () => {
  let component: ExpedientesEconomicosComponent;
  let fixture: ComponentFixture<ExpedientesEconomicosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpedientesEconomicosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpedientesEconomicosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
