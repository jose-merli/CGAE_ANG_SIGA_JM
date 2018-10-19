import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CargaEtiquetasComponent } from './carga-etiquetas.component';

describe('CargaEtiquetasComponent', () => {
  let component: CargaEtiquetasComponent;
  let fixture: ComponentFixture<CargaEtiquetasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CargaEtiquetasComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CargaEtiquetasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
