import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatosGeneralesGuardiasComponent } from './datos-generales-guardias.component';

describe('DatosGeneralesGuardiasComponent', () => {
  let component: DatosGeneralesGuardiasComponent;
  let fixture: ComponentFixture<DatosGeneralesGuardiasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatosGeneralesGuardiasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatosGeneralesGuardiasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
