import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaResultadoMixSaltosCompOficioComponent } from './tabla-resultado-mix-saltos-comp-oficio.component';

describe('TablaResultadoMixSaltosCompOficioComponent', () => {
  let component: TablaResultadoMixSaltosCompOficioComponent;
  let fixture: ComponentFixture<TablaResultadoMixSaltosCompOficioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TablaResultadoMixSaltosCompOficioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TablaResultadoMixSaltosCompOficioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
