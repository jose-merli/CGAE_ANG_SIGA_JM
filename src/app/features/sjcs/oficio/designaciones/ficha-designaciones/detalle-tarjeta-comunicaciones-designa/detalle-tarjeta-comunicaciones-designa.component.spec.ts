import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleTarjetaComunicacionesDesignaComponent } from './detalle-tarjeta-comunicaciones-designa.component';

describe('DetalleTarjetaComunicacionesDesignaComponent', () => {
  let component: DetalleTarjetaComunicacionesDesignaComponent;
  let fixture: ComponentFixture<DetalleTarjetaComunicacionesDesignaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetalleTarjetaComunicacionesDesignaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleTarjetaComunicacionesDesignaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
