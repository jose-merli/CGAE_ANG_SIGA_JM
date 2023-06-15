import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenFacturaFactProgramadasComponent } from './gen-factura-fact-programadas.component';

describe('GenFacturaFactProgramadasComponent', () => {
  let component: GenFacturaFactProgramadasComponent;
  let fixture: ComponentFixture<GenFacturaFactProgramadasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenFacturaFactProgramadasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenFacturaFactProgramadasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
