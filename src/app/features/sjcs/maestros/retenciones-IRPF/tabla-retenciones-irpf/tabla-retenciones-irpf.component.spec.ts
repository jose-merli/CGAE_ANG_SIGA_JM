import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaRetencionesIrpfComponent } from './tabla-retenciones-irpf.component';

describe('TablaRetencionesIrpfComponent', () => {
  let component: TablaRetencionesIrpfComponent;
  let fixture: ComponentFixture<TablaRetencionesIrpfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TablaRetencionesIrpfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TablaRetencionesIrpfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
