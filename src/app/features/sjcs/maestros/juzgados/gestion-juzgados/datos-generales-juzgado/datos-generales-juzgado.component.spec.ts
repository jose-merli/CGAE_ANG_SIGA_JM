import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatosGeneralesJuzgadoComponent } from './datos-generales-juzgado.component';

describe('DatosGeneralesJuzgadoComponent', () => {
  let component: DatosGeneralesJuzgadoComponent;
  let fixture: ComponentFixture<DatosGeneralesJuzgadoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatosGeneralesJuzgadoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatosGeneralesJuzgadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
