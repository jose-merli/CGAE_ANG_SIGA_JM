import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatosGeneralesFundamentosComponent } from './datos-generales-fundamentos.component';

describe('DatosGeneralesFundamentosComponent', () => {
  let component: DatosGeneralesFundamentosComponent;
  let fixture: ComponentFixture<DatosGeneralesFundamentosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatosGeneralesFundamentosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatosGeneralesFundamentosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
