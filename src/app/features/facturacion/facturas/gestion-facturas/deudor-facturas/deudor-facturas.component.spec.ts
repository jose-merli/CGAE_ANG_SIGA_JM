import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeudorFacturasComponent } from './deudor-facturas.component';

describe('DeudorFacturasComponent', () => {
  let component: DeudorFacturasComponent;
  let fixture: ComponentFixture<DeudorFacturasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeudorFacturasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeudorFacturasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
