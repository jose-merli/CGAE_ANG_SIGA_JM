import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BuscadorColegiadosExpressComponent } from './buscador-colegiados-express.component';

describe('BusquedaColegiadoExpressComponent', () => {
  let component: BuscadorColegiadosExpressComponent;
  let fixture: ComponentFixture<BuscadorColegiadosExpressComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BuscadorColegiadosExpressComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuscadorColegiadosExpressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});