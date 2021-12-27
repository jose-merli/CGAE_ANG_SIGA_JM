import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EjgComisionBusquedaComponent } from './ejg-comision-busqueda.component';

describe('EjgComisionBusquedaComponent', () => {
  let component: EjgComisionBusquedaComponent;
  let fixture: ComponentFixture<EjgComisionBusquedaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EjgComisionBusquedaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EjgComisionBusquedaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
