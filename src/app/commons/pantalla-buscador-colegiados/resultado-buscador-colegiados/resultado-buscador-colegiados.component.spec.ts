import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultadoBuscadorColegiadosComponent } from './resultado-buscador-colegiados.component';

describe('ResultadoBuscadorColegiadosComponent', () => {
  let component: ResultadoBuscadorColegiadosComponent;
  let fixture: ComponentFixture<ResultadoBuscadorColegiadosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResultadoBuscadorColegiadosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultadoBuscadorColegiadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
