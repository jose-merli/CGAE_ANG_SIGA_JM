import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TarjetaDatosRetencionComponent } from './tarjeta-datos-retencion.component';

describe('TarjetaDatosRetencionComponent', () => {
  let component: TarjetaDatosRetencionComponent;
  let fixture: ComponentFixture<TarjetaDatosRetencionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TarjetaDatosRetencionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TarjetaDatosRetencionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
