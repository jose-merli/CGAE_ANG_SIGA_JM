import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TarjetaResolucionEjgsComponent } from './tarjeta-resolucion-ejgs.component';

describe('TarjetaResolucionEjgsComponent', () => {
  let component: TarjetaResolucionEjgsComponent;
  let fixture: ComponentFixture<TarjetaResolucionEjgsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TarjetaResolucionEjgsComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TarjetaResolucionEjgsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
