import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaGenerarImpreso190Component } from './tabla-generar-impreso190.component';

describe('TablaGenerarImpreso190Component', () => {
  let component: TablaGenerarImpreso190Component;
  let fixture: ComponentFixture<TablaGenerarImpreso190Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TablaGenerarImpreso190Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TablaGenerarImpreso190Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
