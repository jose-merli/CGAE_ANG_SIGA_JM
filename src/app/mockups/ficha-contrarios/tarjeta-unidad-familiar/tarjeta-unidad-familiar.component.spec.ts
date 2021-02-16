import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TarjetaUnidadFamiliarComponent } from './tarjeta-unidad-familiar.component';

describe('TarjetaUnidadFamiliarComponent', () => {
  let component: TarjetaUnidadFamiliarComponent;
  let fixture: ComponentFixture<TarjetaUnidadFamiliarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TarjetaUnidadFamiliarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TarjetaUnidadFamiliarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
