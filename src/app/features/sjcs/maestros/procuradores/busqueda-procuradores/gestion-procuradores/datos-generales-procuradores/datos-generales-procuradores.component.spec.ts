import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatosGeneralesProcuradoresComponent } from './datos-generales-procuradores.component';

describe('DatosGeneralesProcuradoresComponent', () => {
  let component: DatosGeneralesProcuradoresComponent;
  let fixture: ComponentFixture<DatosGeneralesProcuradoresComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatosGeneralesProcuradoresComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatosGeneralesProcuradoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
