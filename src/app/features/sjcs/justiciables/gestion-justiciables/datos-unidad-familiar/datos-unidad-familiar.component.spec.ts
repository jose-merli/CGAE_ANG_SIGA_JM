import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatosUnidadFamiliarComponent } from './datos-unidad-familiar.component';

describe('DatosUnidadFamiliarComponent', () => {
  let component: DatosUnidadFamiliarComponent;
  let fixture: ComponentFixture<DatosUnidadFamiliarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatosUnidadFamiliarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatosUnidadFamiliarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
