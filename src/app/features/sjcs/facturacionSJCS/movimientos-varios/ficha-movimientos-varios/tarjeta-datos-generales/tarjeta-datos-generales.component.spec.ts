import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TarjetaDatosGeneralesComponent } from './tarjeta-datos-generales.component';

describe('TarjetaDatosGeneralesComponent', () => {
  let component: TarjetaDatosGeneralesComponent;
  let fixture: ComponentFixture<TarjetaDatosGeneralesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TarjetaDatosGeneralesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TarjetaDatosGeneralesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
