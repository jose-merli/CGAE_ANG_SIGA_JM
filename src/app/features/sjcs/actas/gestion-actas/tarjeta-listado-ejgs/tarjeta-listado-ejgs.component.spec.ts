import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TarjetaListadoEjgsComponent } from './tarjeta-listado-ejgs.component';

describe('TarjetaListadoEjgsComponent', () => {
  let component: TarjetaListadoEjgsComponent;
  let fixture: ComponentFixture<TarjetaListadoEjgsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TarjetaListadoEjgsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TarjetaListadoEjgsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
