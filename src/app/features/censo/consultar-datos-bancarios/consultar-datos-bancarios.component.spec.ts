import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultarDatosBancariosComponent } from './consultar-datos-bancarios.component';

describe('ConsultarDatosBancariosComponent', () => {
  let component: ConsultarDatosBancariosComponent;
  let fixture: ComponentFixture<ConsultarDatosBancariosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsultarDatosBancariosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultarDatosBancariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
