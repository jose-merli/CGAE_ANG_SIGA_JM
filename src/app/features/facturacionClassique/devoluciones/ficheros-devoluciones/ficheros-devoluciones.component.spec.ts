import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FicherosDevolucionesClassiqueComponent } from './ficheros-devoluciones.component';

describe('FicherosDevolucionesClassiqueComponent', () => {
  let component: FicherosDevolucionesClassiqueComponent;
  let fixture: ComponentFixture<FicherosDevolucionesClassiqueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FicherosDevolucionesClassiqueComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FicherosDevolucionesClassiqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
