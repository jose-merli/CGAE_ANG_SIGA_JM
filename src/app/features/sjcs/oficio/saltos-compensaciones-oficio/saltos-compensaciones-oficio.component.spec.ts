import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SaltosCompensacionesOficioComponent } from './saltos-compensaciones-oficio.component';

describe('SaltosCompensacionesOficioComponent', () => {
  let component: SaltosCompensacionesOficioComponent;
  let fixture: ComponentFixture<SaltosCompensacionesOficioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SaltosCompensacionesOficioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaltosCompensacionesOficioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
