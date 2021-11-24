import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaResultadoMixSaltosCompGuardiaComponent } from './tabla-resultado-mix-saltos-comp-guardia.component';

describe('TablaResultadoMixSaltosCompGuardiaComponent', () => {
  let component: TablaResultadoMixSaltosCompGuardiaComponent;
  let fixture: ComponentFixture<TablaResultadoMixSaltosCompGuardiaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TablaResultadoMixSaltosCompGuardiaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TablaResultadoMixSaltosCompGuardiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
