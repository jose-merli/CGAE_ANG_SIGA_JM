import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatosGeneralesComisariaComponent } from './datos-generales-comisaria.component';

describe('DatosGeneralesComisariaComponent', () => {
  let component: DatosGeneralesComisariaComponent;
  let fixture: ComponentFixture<DatosGeneralesComisariaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatosGeneralesComisariaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatosGeneralesComisariaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
