import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltrosSaltosCompensacionesGuardiaComponent } from './filtros-saltos-compensaciones-guardia.component';

describe('FiltrosSaltosCompensacionesGuardiaComponent', () => {
  let component: FiltrosSaltosCompensacionesGuardiaComponent;
  let fixture: ComponentFixture<FiltrosSaltosCompensacionesGuardiaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FiltrosSaltosCompensacionesGuardiaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FiltrosSaltosCompensacionesGuardiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
