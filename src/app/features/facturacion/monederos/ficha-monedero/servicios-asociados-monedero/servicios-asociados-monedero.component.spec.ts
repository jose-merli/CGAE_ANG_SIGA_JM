import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiciosAsociadosMonederoComponent } from './servicios-asociados-monedero.component';

describe('ServiciosAsociadosMonederoComponent', () => {
  let component: ServiciosAsociadosMonederoComponent;
  let fixture: ComponentFixture<ServiciosAsociadosMonederoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServiciosAsociadosMonederoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiciosAsociadosMonederoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
