import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InformeCalificacionComponent } from './informe-calificacion.component';

describe('InformeCalificacionComponent', () => {
  let component: InformeCalificacionComponent;
  let fixture: ComponentFixture<InformeCalificacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InformeCalificacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InformeCalificacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
