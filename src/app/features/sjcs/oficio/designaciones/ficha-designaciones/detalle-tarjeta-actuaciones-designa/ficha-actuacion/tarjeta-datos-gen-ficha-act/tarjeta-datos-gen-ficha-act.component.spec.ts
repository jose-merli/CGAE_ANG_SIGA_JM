import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TarjetaDatosGenFichaActComponent } from './tarjeta-datos-gen-ficha-act.component';

describe('TarjetaDatosGenFichaActComponent', () => {
  let component: TarjetaDatosGenFichaActComponent;
  let fixture: ComponentFixture<TarjetaDatosGenFichaActComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TarjetaDatosGenFichaActComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TarjetaDatosGenFichaActComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
