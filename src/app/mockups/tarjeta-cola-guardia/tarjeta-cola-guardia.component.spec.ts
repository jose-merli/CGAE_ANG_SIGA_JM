import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TarjetaColaGuardiaComponent } from './tarjeta-cola-guardia.component';

describe('TarjetaColaGuardiaComponent', () => {
  let component: TarjetaColaGuardiaComponent;
  let fixture: ComponentFixture<TarjetaColaGuardiaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TarjetaColaGuardiaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TarjetaColaGuardiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
