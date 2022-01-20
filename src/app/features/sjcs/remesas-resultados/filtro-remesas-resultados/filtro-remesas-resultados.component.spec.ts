import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltroRemesasResultadosComponent } from './filtro-remesas-resultados.component';

describe('FiltroRemesasResultadosComponent', () => {
  let component: FiltroRemesasResultadosComponent;
  let fixture: ComponentFixture<FiltroRemesasResultadosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FiltroRemesasResultadosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FiltroRemesasResultadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
