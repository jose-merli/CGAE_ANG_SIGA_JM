import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GuardiasAsistenciasComponent } from './guardias-asistencias.component';

describe('GuardiasAsistenciasComponent', () => {
  let component: GuardiasAsistenciasComponent;
  let fixture: ComponentFixture<GuardiasAsistenciasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GuardiasAsistenciasComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GuardiasAsistenciasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
