import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatosIntegrantesComponent } from './../datos-integrantes.component';

describe('DatosIntegrantesComponent', () => {
  let component: DatosIntegrantesComponent;
  let fixture: ComponentFixture<DatosIntegrantesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatosIntegrantesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatosIntegrantesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
