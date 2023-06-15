import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleTarjetaLetradosDesignaComponent } from './detalle-tarjeta-letrados-designa.component';

describe('DetalleTarjetaLetradosDesignaComponent', () => {
  let component: DetalleTarjetaLetradosDesignaComponent;
  let fixture: ComponentFixture<DetalleTarjetaLetradosDesignaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetalleTarjetaLetradosDesignaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleTarjetaLetradosDesignaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
