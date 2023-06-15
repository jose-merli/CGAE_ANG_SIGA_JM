import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatosTurnoGuardiasComponent } from './datos-turno-guardias.component';

describe('DatosTurnoGuardiasComponent', () => {
  let component: DatosTurnoGuardiasComponent;
  let fixture: ComponentFixture<DatosTurnoGuardiasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatosTurnoGuardiasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatosTurnoGuardiasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
