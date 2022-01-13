import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BuscadorAsistenciasComponent } from './buscador-asistencias.component';

describe('BuscadorAsistenciasComponent', () => {
  let component: BuscadorAsistenciasComponent;
  let fixture: ComponentFixture<BuscadorAsistenciasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BuscadorAsistenciasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuscadorAsistenciasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
