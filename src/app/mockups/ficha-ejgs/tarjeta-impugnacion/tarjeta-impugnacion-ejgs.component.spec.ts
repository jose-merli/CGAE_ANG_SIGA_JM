import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TarjetaImpugnacionEjgsComponent } from './tarjeta-impugnacion-ejgs.component';

describe('TarjetaImpugnacionEjgsComponent', () => {
  let component: TarjetaImpugnacionEjgsComponent;
  let fixture: ComponentFixture<TarjetaImpugnacionEjgsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TarjetaImpugnacionEjgsComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TarjetaImpugnacionEjgsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
