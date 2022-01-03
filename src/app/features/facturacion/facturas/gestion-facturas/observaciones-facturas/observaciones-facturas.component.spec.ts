import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ObservacionesFacturasComponent } from './observaciones-facturas.component';

describe('ObservacionesFacturasComponent', () => {
  let component: ObservacionesFacturasComponent;
  let fixture: ComponentFixture<ObservacionesFacturasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ObservacionesFacturasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ObservacionesFacturasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
