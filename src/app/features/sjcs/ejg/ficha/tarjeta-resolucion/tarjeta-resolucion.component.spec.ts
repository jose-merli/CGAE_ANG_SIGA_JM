import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TarjetaResolucionComponent } from './tarjeta-resolucion.component';

describe('TarjetaResolucionComponent', () => {
  let component: TarjetaResolucionComponent;
  let fixture: ComponentFixture<TarjetaResolucionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TarjetaResolucionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TarjetaResolucionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
