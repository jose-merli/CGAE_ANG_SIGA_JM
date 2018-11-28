import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FichaRegistroComunicacionComponent } from './ficha-registro-comunicacion.component';

describe('FichaRegistroComunicacionComponent', () => {
  let component: FichaRegistroComunicacionComponent;
  let fixture: ComponentFixture<FichaRegistroComunicacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FichaRegistroComunicacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FichaRegistroComunicacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
