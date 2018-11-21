import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlantillasEnviosConsultasComponent } from './plantillas-envios-consultas.component';

describe('PlantillasEnviosConsultasComponent', () => {
  let component: PlantillasEnviosConsultasComponent;
  let fixture: ComponentFixture<PlantillasEnviosConsultasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlantillasEnviosConsultasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlantillasEnviosConsultasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
