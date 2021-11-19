import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SerieFacturaFactProgramadasComponent } from './serie-factura-fact-programadas.component';

describe('SerieFacturaFactProgramadasComponent', () => {
  let component: SerieFacturaFactProgramadasComponent;
  let fixture: ComponentFixture<SerieFacturaFactProgramadasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SerieFacturaFactProgramadasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SerieFacturaFactProgramadasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
