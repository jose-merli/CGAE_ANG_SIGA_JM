import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltroCertificacionFacComponent } from './filtro-certificacion-fac.component';

describe('FiltroCertificacionFacComponent', () => {
  let component: FiltroCertificacionFacComponent;
  let fixture: ComponentFixture<FiltroCertificacionFacComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FiltroCertificacionFacComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FiltroCertificacionFacComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
