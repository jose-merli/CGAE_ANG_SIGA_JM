import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiciosTramitacionComponent } from './servicios-tramitacion.component';

describe('ServiciosTramitacionComponent', () => {
  let component: ServiciosTramitacionComponent;
  let fixture: ComponentFixture<ServiciosTramitacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServiciosTramitacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiciosTramitacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
