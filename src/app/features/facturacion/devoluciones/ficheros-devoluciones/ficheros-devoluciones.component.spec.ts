import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FicherosDevolucionesComponent } from './ficheros-devoluciones.component';

describe('FicherosDevolucionesComponent', () => {
  let component: FicherosDevolucionesComponent;
  let fixture: ComponentFixture<FicherosDevolucionesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FicherosDevolucionesComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FicherosDevolucionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
