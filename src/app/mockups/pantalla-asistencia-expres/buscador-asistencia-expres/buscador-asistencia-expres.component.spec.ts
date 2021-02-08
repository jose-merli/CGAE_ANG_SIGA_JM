import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuscadorAsistenciaExpresComponent } from './buscador-asistencia-expres.component';

describe('BuscadorAsistenciaExpresComponent', () => {
  let component: BuscadorAsistenciaExpresComponent;
  let fixture: ComponentFixture<BuscadorAsistenciaExpresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BuscadorAsistenciaExpresComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BuscadorAsistenciaExpresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
