import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltrosRetencionesIrpfComponent } from './filtros-retenciones-irpf.component';

describe('FiltrosRetencionesIrpfComponent', () => {
  let component: FiltrosRetencionesIrpfComponent;
  let fixture: ComponentFixture<FiltrosRetencionesIrpfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FiltrosRetencionesIrpfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FiltrosRetencionesIrpfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
