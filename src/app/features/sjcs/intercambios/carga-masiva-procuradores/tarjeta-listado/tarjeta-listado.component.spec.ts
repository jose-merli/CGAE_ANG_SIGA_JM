import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TarjetaListadoComponent } from './tarjeta-listado.component';

describe('TarjetaListadoComponent', () => {
  let component: TarjetaListadoComponent;
  let fixture: ComponentFixture<TarjetaListadoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TarjetaListadoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TarjetaListadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
