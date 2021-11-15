import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatosGeneracionAdeudosComponent } from './datos-generacion-adeudos.component';

describe('DatosGeneracionAdeudosComponent', () => {
  let component: DatosGeneracionAdeudosComponent;
  let fixture: ComponentFixture<DatosGeneracionAdeudosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatosGeneracionAdeudosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatosGeneracionAdeudosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
