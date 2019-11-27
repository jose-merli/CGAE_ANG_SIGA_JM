import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatosIncompatibilidadesComponent } from './datos-incompatibilidades.component';

describe('DatosIncompatibilidadesComponent', () => {
  let component: DatosIncompatibilidadesComponent;
  let fixture: ComponentFixture<DatosIncompatibilidadesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatosIncompatibilidadesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatosIncompatibilidadesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
