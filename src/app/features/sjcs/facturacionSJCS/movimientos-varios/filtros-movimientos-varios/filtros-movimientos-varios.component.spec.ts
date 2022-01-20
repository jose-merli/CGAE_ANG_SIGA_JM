import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltrosMovimientosVariosComponent } from './filtros-movimientos-varios.component';

describe('FiltrosMovimientosVariosComponent', () => {
  let component: FiltrosMovimientosVariosComponent;
  let fixture: ComponentFixture<FiltrosMovimientosVariosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FiltrosMovimientosVariosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FiltrosMovimientosVariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
