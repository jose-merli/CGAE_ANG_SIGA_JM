import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TarjetaRelacionesFichaActComponent } from './tarjeta-relaciones-ficha-act.component';

describe('TarjetaRelacionesFichaActComponent', () => {
  let component: TarjetaRelacionesFichaActComponent;
  let fixture: ComponentFixture<TarjetaRelacionesFichaActComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TarjetaRelacionesFichaActComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TarjetaRelacionesFichaActComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
