import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerarImpreso190Component } from './generar-impreso190.component';

describe('GenerarImpreso190Component', () => {
  let component: GenerarImpreso190Component;
  let fixture: ComponentFixture<GenerarImpreso190Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GenerarImpreso190Component]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenerarImpreso190Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
