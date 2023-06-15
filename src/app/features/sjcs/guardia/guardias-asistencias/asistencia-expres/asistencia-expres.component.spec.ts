import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsistenciaExpresComponent } from './asistencia-expres.component';

describe('AsistenciaExpresComponent', () => {
  let component: AsistenciaExpresComponent;
  let fixture: ComponentFixture<AsistenciaExpresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AsistenciaExpresComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AsistenciaExpresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
