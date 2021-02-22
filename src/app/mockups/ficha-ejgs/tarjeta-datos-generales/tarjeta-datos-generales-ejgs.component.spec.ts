import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TarjetaDatosGeneralesEjgsComponent } from './tarjeta-datos-generales-ejgs.component';

describe('TarjetaDatosGeneralesEjgsComponent', () => {
  let component: TarjetaDatosGeneralesEjgsComponent;
  let fixture: ComponentFixture<TarjetaDatosGeneralesEjgsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TarjetaDatosGeneralesEjgsComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TarjetaDatosGeneralesEjgsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
