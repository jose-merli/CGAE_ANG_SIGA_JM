import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultadoBuscadorProcuradorComponent } from './resultado-buscador-procurador.component';

describe('ResultadoBuscadorProcuradorComponent', () => {
  let component: ResultadoBuscadorProcuradorComponent;
  let fixture: ComponentFixture<ResultadoBuscadorProcuradorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResultadoBuscadorProcuradorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultadoBuscadorProcuradorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
