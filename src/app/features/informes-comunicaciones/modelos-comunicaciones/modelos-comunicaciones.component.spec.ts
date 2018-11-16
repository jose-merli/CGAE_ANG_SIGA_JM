import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelosComunicacionesComponent } from './modelos-comunicaciones.component';

describe('ModelosComunicacionesComponent', () => {
  let component: ModelosComunicacionesComponent;
  let fixture: ComponentFixture<ModelosComunicacionesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModelosComunicacionesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModelosComunicacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
