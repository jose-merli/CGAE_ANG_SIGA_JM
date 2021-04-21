import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TarjetaRelFichaActComponent } from './tarjeta-rel-ficha-act.component';

describe('TarjetaRelFichaActComponent', () => {
  let component: TarjetaRelFichaActComponent;
  let fixture: ComponentFixture<TarjetaRelFichaActComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TarjetaRelFichaActComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TarjetaRelFichaActComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
