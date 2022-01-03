import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltrosFacturasComponent } from './filtros-facturas.component';

describe('FiltrosFacturasComponent', () => {
  let component: FiltrosFacturasComponent;
  let fixture: ComponentFixture<FiltrosFacturasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FiltrosFacturasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FiltrosFacturasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
