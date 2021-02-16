import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleTarjetaDatosRenuncianteComponent } from './detalle-tarjeta-datos-renunciante.component';

describe('DetalleTarjetaDatosRenuncianteComponent', () => {
  let component: DetalleTarjetaDatosRenuncianteComponent;
  let fixture: ComponentFixture<DetalleTarjetaDatosRenuncianteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetalleTarjetaDatosRenuncianteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleTarjetaDatosRenuncianteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
