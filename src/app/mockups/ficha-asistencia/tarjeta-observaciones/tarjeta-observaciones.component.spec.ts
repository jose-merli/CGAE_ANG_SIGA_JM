import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TarjetaObservacionesComponent } from './tarjeta-observaciones.component';

describe('TarjetaObservacionesComponent', () => {
  let component: TarjetaObservacionesComponent;
  let fixture: ComponentFixture<TarjetaObservacionesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TarjetaObservacionesComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TarjetaObservacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
