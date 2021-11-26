import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaFicherosDevolucionesComponent } from './tabla-ficheros-devoluciones.component';

describe('TablaFicherosDevolucionesComponent', () => {
  let component: TablaFicherosDevolucionesComponent;
  let fixture: ComponentFixture<TablaFicherosDevolucionesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TablaFicherosDevolucionesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TablaFicherosDevolucionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
