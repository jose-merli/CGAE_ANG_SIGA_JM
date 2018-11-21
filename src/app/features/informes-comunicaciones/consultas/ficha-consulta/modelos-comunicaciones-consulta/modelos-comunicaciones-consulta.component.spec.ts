import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelosComunicacionesConsultaComponent } from './modelos-comunicaciones-consulta.component';

describe('ModelosComunicacionesConsultaComponent', () => {
  let component: ModelosComunicacionesConsultaComponent;
  let fixture: ComponentFixture<ModelosComunicacionesConsultaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModelosComunicacionesConsultaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModelosComunicacionesConsultaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
