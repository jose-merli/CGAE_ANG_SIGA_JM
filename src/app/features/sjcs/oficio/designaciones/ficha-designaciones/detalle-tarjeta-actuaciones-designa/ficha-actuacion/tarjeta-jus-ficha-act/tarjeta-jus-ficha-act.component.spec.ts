import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TarjetaJusFichaActComponent } from './tarjeta-jus-ficha-act.component';

describe('TarjetaJusFichaActComponent', () => {
  let component: TarjetaJusFichaActComponent;
  let fixture: ComponentFixture<TarjetaJusFichaActComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TarjetaJusFichaActComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TarjetaJusFichaActComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
