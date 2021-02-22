import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TarjetaDocumentacionEjgsComponent } from './tarjeta-documentacion-ejgs.component';

describe('TarjetaDocumentacionEjgsComponent', () => {
  let component: TarjetaDocumentacionEjgsComponent;
  let fixture: ComponentFixture<TarjetaDocumentacionEjgsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TarjetaDocumentacionEjgsComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TarjetaDocumentacionEjgsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
