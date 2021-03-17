import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuscadorJustificacionExpresComponent } from './buscador-justificacion-expres.component';

describe('BuscadorJustificacionExpresComponent', () => {
  let component: BuscadorJustificacionExpresComponent;
  let fixture: ComponentFixture<BuscadorJustificacionExpresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BuscadorJustificacionExpresComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BuscadorJustificacionExpresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
