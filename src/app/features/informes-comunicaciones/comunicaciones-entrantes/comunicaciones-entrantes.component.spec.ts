import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComunicacionesEntrantesComponent } from './comunicaciones-entrantes.component';

describe('ComunicacionesEntrantesComponent', () => {
  let component: ComunicacionesEntrantesComponent;
  let fixture: ComponentFixture<ComunicacionesEntrantesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComunicacionesEntrantesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComunicacionesEntrantesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
