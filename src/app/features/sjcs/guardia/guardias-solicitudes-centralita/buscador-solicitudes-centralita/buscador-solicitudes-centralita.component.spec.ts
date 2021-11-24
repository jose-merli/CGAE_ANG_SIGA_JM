import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BuscadorSolicitudesCentralitaComponent } from './buscador-solicitudes-centralita.component';

describe('BuscadorSolicitudesCentralitaComponent', () => {
  let component: BuscadorSolicitudesCentralitaComponent;
  let fixture: ComponentFixture<BuscadorSolicitudesCentralitaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BuscadorSolicitudesCentralitaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuscadorSolicitudesCentralitaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
