import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TarjetaDatosFactFichaActComponent } from './tarjeta-datos-fact-ficha-act.component';

describe('TarjetaDatosFactFichaActComponent', () => {
  let component: TarjetaDatosFactFichaActComponent;
  let fixture: ComponentFixture<TarjetaDatosFactFichaActComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TarjetaDatosFactFichaActComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TarjetaDatosFactFichaActComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
