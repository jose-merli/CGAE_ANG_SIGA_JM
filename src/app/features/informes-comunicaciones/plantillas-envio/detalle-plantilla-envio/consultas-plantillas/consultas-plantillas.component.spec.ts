import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultasPlantillasComponent } from './consultas-plantillas.component';

describe('ConsultasPlantillasComponent', () => {
  let component: ConsultasPlantillasComponent;
  let fixture: ComponentFixture<ConsultasPlantillasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsultasPlantillasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultasPlantillasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
