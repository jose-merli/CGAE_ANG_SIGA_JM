import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TarjetaImpugnacionComponent } from './tarjeta-impugnacion.component';

describe('TarjetaInpugnacionComponent', () => {
  let component: TarjetaImpugnacionComponent;
  let fixture: ComponentFixture<TarjetaImpugnacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TarjetaImpugnacionComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TarjetaImpugnacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
