import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ObservacionesRectificativaFacturasComponent } from './observaciones-rectificativa-facturas.component';

describe('ObservacionesRectificativaFacturasComponent', () => {
  let component: ObservacionesRectificativaFacturasComponent;
  let fixture: ComponentFixture<ObservacionesRectificativaFacturasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ObservacionesRectificativaFacturasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ObservacionesRectificativaFacturasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
