import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TarjetaListadoCmcComponent } from './tarjeta-listado-cmc.component';

describe('TarjetaListadoCmcComponent', () => {
  let component: TarjetaListadoCmcComponent;
  let fixture: ComponentFixture<TarjetaListadoCmcComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TarjetaListadoCmcComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TarjetaListadoCmcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
