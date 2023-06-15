import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiciosTramitacionDetalleSojComponent } from './servicios-tramitacion-detalle-soj.component';

describe('ServiciosTramitacionDetalleSojComponent', () => {
  let component: ServiciosTramitacionDetalleSojComponent;
  let fixture: ComponentFixture<ServiciosTramitacionDetalleSojComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServiciosTramitacionDetalleSojComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiciosTramitacionDetalleSojComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
