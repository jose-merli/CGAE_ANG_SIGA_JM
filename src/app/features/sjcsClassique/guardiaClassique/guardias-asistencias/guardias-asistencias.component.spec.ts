import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GuardiasAsistenciasClassiqueComponent } from './guardias-asistencias.component';

describe('GuardiasAsistenciasClassiqueComponent', () => {
  let component: GuardiasAsistenciasClassiqueComponent;
  let fixture: ComponentFixture<GuardiasAsistenciasClassiqueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GuardiasAsistenciasClassiqueComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GuardiasAsistenciasClassiqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
