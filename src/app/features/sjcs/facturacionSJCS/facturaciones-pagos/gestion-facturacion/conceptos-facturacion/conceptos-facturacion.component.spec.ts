import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConceptosFacturacionComponent } from './conceptos-facturacion.component';

describe('ConceptosFacturacionComponent', () => {
  let component: ConceptosFacturacionComponent;
  let fixture: ComponentFixture<ConceptosFacturacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConceptosFacturacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConceptosFacturacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
