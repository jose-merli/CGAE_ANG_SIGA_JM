import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SaltosCompensacionesGuardiaComponent } from './saltos-compensaciones-guardia.component';

describe('SaltosCompensacionesGuardiaComponent', () => {
  let component: SaltosCompensacionesGuardiaComponent;
  let fixture: ComponentFixture<SaltosCompensacionesGuardiaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SaltosCompensacionesGuardiaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaltosCompensacionesGuardiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
