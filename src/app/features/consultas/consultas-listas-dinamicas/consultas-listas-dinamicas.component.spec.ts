import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultasListasDinamicasComponent } from './consultas-listas-dinamicas.component';

describe('ConsultasListasDinamicasComponent', () => {
  let component: ConsultasListasDinamicasComponent;
  let fixture: ComponentFixture<ConsultasListasDinamicasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ConsultasListasDinamicasComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultasListasDinamicasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
