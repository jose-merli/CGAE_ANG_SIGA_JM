import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatosDireccionesComponent } from './datos-direcciones.component';

describe('DatosDireccionesComponent', () => {
  let component: DatosDireccionesComponent;
  let fixture: ComponentFixture<DatosDireccionesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatosDireccionesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatosDireccionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
