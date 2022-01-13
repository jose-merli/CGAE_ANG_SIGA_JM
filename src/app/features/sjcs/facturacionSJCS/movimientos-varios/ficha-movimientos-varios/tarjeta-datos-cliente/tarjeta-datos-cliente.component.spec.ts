import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TarjetaDatosClienteComponent } from './tarjeta-datos-cliente.component';

describe('TarjetaDatosClienteComponent', () => {
  let component: TarjetaDatosClienteComponent;
  let fixture: ComponentFixture<TarjetaDatosClienteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TarjetaDatosClienteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TarjetaDatosClienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
