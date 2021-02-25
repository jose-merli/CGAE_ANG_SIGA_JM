import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TarjetaRelacionesEjgsComponent } from './tarjeta-relaciones-ejgs.component';

describe('TarjetaRelacionesEjgsComponent', () => {
  let component: TarjetaRelacionesEjgsComponent;
  let fixture: ComponentFixture<TarjetaRelacionesEjgsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TarjetaRelacionesEjgsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TarjetaRelacionesEjgsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
