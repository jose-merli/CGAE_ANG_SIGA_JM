import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatosAbogadoContrarioComponent } from './datos-abogado-contrario.component';

describe('DatosAbogadoContrarioComponent', () => {
  let component: DatosAbogadoContrarioComponent;
  let fixture: ComponentFixture<DatosAbogadoContrarioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatosAbogadoContrarioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatosAbogadoContrarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
