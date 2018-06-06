import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitudCompraSubscripcionComponent } from './solicitudCompraSubscripcion.component';

describe('SolicitudCompraSubscripcionComponent', () => {
  let component: SolicitudCompraSubscripcionComponent;
  let fixture: ComponentFixture<SolicitudCompraSubscripcionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SolicitudCompraSubscripcionComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SolicitudCompraSubscripcionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
