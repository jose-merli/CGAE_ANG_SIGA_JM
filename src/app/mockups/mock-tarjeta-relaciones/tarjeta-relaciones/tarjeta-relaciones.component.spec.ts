import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TarjetaRelacionesComponent } from './tarjeta-relaciones.component';

describe('TarjetaRelacionesComponent', () => {
  let component: TarjetaRelacionesComponent;
  let fixture: ComponentFixture<TarjetaRelacionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TarjetaRelacionesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TarjetaRelacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
