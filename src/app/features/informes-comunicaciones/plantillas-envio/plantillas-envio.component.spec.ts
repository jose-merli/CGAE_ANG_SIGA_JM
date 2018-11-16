import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlantillasEnvioComponent } from './plantillas-envio.component';

describe('PlantillasEnvioComponent', () => {
  let component: PlantillasEnvioComponent;
  let fixture: ComponentFixture<PlantillasEnvioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlantillasEnvioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlantillasEnvioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
