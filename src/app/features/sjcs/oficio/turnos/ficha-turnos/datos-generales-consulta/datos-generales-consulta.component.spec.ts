import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatosGeneralesTurnosComponent } from './datos-generales-consulta.component';

describe('DatosGeneralesConsultaComponent', () => {
  let component: DatosGeneralesTurnosComponent;
  let fixture: ComponentFixture<DatosGeneralesTurnosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DatosGeneralesTurnosComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatosGeneralesTurnosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
