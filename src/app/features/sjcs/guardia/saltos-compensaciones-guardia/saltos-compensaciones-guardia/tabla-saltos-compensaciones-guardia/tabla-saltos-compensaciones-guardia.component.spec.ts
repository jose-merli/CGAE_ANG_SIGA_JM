import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaSaltosCompensacionesGuardiaComponent } from './tabla-saltos-compensaciones-guardia.component';

describe('TablaSaltosCompensacionesGuardiaComponent', () => {
  let component: TablaSaltosCompensacionesGuardiaComponent;
  let fixture: ComponentFixture<TablaSaltosCompensacionesGuardiaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TablaSaltosCompensacionesGuardiaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TablaSaltosCompensacionesGuardiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
