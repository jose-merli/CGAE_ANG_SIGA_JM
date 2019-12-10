import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusquedaAsuntosComponent } from './busqueda-asuntos.component';

describe('BusquedaAsuntosComponent', () => {
  let component: BusquedaAsuntosComponent;
  let fixture: ComponentFixture<BusquedaAsuntosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BusquedaAsuntosComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusquedaAsuntosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
