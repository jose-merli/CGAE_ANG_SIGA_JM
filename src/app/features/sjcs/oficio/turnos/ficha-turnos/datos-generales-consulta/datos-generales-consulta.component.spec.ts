import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatosGeneralesConsultaComponent } from './datos-generales-consulta.component';

describe('DatosGeneralesConsultaComponent', () => {
  let component: DatosGeneralesConsultaComponent;
  let fixture: ComponentFixture<DatosGeneralesConsultaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatosGeneralesConsultaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatosGeneralesConsultaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
