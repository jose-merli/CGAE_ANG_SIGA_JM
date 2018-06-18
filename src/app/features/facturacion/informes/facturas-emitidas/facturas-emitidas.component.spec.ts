import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FacturasEmitidasComponent } from './facturas-emitidas.component';

describe('FacturasEmitidasComponent', () => {
  let component: FacturasEmitidasComponent;
  let fixture: ComponentFixture<FacturasEmitidasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FacturasEmitidasComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FacturasEmitidasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
