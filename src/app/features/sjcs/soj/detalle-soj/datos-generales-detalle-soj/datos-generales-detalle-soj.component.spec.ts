import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatosGeneralesDetalleSojComponent } from './datos-generales-detalle-soj.component';

describe('DatosGeneralesDetalleSojComponent', () => {
  let component: DatosGeneralesDetalleSojComponent;
  let fixture: ComponentFixture<DatosGeneralesDetalleSojComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatosGeneralesDetalleSojComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatosGeneralesDetalleSojComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
