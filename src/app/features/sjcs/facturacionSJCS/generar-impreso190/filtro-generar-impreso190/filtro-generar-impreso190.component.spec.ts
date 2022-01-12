import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltroGenerarImpreso190Component } from './filtro-generar-impreso190.component';

describe('FiltroGenerarImpreso190Component', () => {
  let component: FiltroGenerarImpreso190Component;
  let fixture: ComponentFixture<FiltroGenerarImpreso190Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FiltroGenerarImpreso190Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FiltroGenerarImpreso190Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
