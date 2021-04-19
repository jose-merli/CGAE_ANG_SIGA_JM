import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TarjetaDocumentacionFichaActComponent } from './tarjeta-documentacion-ficha-act.component';

describe('TarjetaDocumentacionFichaActComponent', () => {
  let component: TarjetaDocumentacionFichaActComponent;
  let fixture: ComponentFixture<TarjetaDocumentacionFichaActComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TarjetaDocumentacionFichaActComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TarjetaDocumentacionFichaActComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
