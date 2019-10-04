import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatosDireccionesProcuradoresComponent } from './datos-direcciones-procuradores.component';

describe('DatosDireccionesProcuradoresComponent', () => {
  let component: DatosDireccionesProcuradoresComponent;
  let fixture: ComponentFixture<DatosDireccionesProcuradoresComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatosDireccionesProcuradoresComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatosDireccionesProcuradoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
