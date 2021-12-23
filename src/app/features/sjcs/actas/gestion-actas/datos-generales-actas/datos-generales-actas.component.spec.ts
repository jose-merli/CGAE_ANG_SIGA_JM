import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatosGeneralesActasComponent } from './datos-generales-actas.component';

describe('DatosGeneralesActasComponent', () => {
  let component: DatosGeneralesActasComponent;
  let fixture: ComponentFixture<DatosGeneralesActasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatosGeneralesActasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatosGeneralesActasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
