import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TarjetaUnidadFamiliarEjgsComponent } from './tarjeta-unidad-familiar-ejgs.component';

describe('TarjetaUnidadFamiliarEjgsComponent', () => {
  let component: TarjetaUnidadFamiliarEjgsComponent;
  let fixture: ComponentFixture<TarjetaUnidadFamiliarEjgsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TarjetaUnidadFamiliarEjgsComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TarjetaUnidadFamiliarEjgsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
