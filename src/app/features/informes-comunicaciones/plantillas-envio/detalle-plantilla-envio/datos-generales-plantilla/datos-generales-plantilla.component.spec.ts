import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatosGeneralesPlantillaComponent } from './datos-generales-plantilla.component';

describe('DatosGeneralesPlantillaComponent', () => {
  let component: DatosGeneralesPlantillaComponent;
  let fixture: ComponentFixture<DatosGeneralesPlantillaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatosGeneralesPlantillaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatosGeneralesPlantillaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
