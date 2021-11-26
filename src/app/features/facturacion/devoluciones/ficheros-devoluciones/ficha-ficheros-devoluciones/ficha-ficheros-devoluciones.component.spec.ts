import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FichaFicherosDevolucionesComponent } from './ficha-ficheros-devoluciones.component';

describe('FichaFicherosDevolucionesComponent', () => {
  let component: FichaFicherosDevolucionesComponent;
  let fixture: ComponentFixture<FichaFicherosDevolucionesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FichaFicherosDevolucionesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FichaFicherosDevolucionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
