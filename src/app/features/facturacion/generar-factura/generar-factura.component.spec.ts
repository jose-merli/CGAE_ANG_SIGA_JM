import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerarFacturaComponent } from './generar-factura.component';

describe('GenerarFacturaComponent', () => {
  let component: GenerarFacturaComponent;
  let fixture: ComponentFixture<GenerarFacturaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GenerarFacturaComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenerarFacturaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
