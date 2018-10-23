import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MutualidadAbogaciaSeguroAccidentes } from './mutualidad-abogacia-seguro-accidentes.component';

describe('SolicitudesIncorporacionComponent', () => {
  let component: MutualidadAbogaciaSeguroAccidentes;
  let fixture: ComponentFixture<MutualidadAbogaciaSeguroAccidentes>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MutualidadAbogaciaSeguroAccidentes]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MutualidadAbogaciaSeguroAccidentes);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
