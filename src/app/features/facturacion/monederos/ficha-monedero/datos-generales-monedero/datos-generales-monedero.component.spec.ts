import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatosGeneralesMonederoComponent } from './datos-generales-monedero.component';

describe('DatosGeneralesMonederoComponent', () => {
  let component: DatosGeneralesMonederoComponent;
  let fixture: ComponentFixture<DatosGeneralesMonederoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatosGeneralesMonederoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatosGeneralesMonederoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
