import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FichaPagoComponent } from './ficha-pago.component';

describe('FichaPagoComponent', () => {
  let component: FichaPagoComponent;
  let fixture: ComponentFixture<FichaPagoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FichaPagoComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FichaPagoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
