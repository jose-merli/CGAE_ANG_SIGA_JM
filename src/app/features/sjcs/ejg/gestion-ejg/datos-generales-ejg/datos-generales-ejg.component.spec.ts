import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatosGeneralesEjgComponent } from './datos-generales-ejg.component';

describe('DatosGeneralesEjgComponent', () => {
  let component: DatosGeneralesEjgComponent;
  let fixture: ComponentFixture<DatosGeneralesEjgComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatosGeneralesEjgComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatosGeneralesEjgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
