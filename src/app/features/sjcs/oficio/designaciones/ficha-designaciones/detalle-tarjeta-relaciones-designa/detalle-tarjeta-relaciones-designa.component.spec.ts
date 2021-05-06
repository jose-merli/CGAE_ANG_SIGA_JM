import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleTarjetaRelacionesDesignaComponent } from './detalle-tarjeta-relaciones-designa.component';

describe('DetalleTarjetaRelacionesDesignaComponent', () => {
  let component: DetalleTarjetaRelacionesDesignaComponent;
  let fixture: ComponentFixture<DetalleTarjetaRelacionesDesignaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetalleTarjetaRelacionesDesignaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleTarjetaRelacionesDesignaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
