import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionFundamentosresolucionComponent } from './gestion-fundamentosresolucion.component';

describe('GestionFundamentosresolucionComponent', () => {
  let component: GestionFundamentosresolucionComponent;
  let fixture: ComponentFixture<GestionFundamentosresolucionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GestionFundamentosresolucionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionFundamentosresolucionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
