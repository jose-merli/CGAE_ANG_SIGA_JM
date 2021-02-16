import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TarjetaActuacionesComponent } from './tarjeta-actuaciones.component';

describe('TarjetaActuacionesComponent', () => {
  let component: TarjetaActuacionesComponent;
  let fixture: ComponentFixture<TarjetaActuacionesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TarjetaActuacionesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TarjetaActuacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
