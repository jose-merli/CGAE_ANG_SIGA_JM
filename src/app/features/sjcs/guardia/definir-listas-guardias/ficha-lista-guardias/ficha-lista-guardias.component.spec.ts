import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FichaListaGuardiasComponent } from './ficha-lista-guardias.component';

describe('FichaListaGuardiasComponent', () => {
  let component: FichaListaGuardiasComponent;
  let fixture: ComponentFixture<FichaListaGuardiasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FichaListaGuardiasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FichaListaGuardiasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
