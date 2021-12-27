import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BuscadorListaGuardiasComponent } from './buscador-lista-guardias.component';

describe('BuscadorListaGuardiasComponent', () => {
  let component: BuscadorListaGuardiasComponent;
  let fixture: ComponentFixture<BuscadorListaGuardiasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BuscadorListaGuardiasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuscadorListaGuardiasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
