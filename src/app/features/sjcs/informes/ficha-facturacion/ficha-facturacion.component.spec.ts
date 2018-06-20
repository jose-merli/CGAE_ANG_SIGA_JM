import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FichaFacturacionComponent } from './ficha-facturacion.component';

describe('FichaFacturacionComponent', () => {
  let component: FichaFacturacionComponent;
  let fixture: ComponentFixture<FichaFacturacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FichaFacturacionComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FichaFacturacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
