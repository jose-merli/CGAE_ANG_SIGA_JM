import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusquedaColegiadoExpressComponent } from './busqueda-colegiado-express.component';

describe('BusquedaColegiadoExpressComponent', () => {
  let component: BusquedaColegiadoExpressComponent;
  let fixture: ComponentFixture<BusquedaColegiadoExpressComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BusquedaColegiadoExpressComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusquedaColegiadoExpressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});