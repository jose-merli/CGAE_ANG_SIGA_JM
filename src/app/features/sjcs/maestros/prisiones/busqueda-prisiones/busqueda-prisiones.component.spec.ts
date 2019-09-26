import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusquedaPrisionesComponent } from './busqueda-prisiones.component';

describe('BusquedaPrisionesComponent', () => {
  let component: BusquedaPrisionesComponent;
  let fixture: ComponentFixture<BusquedaPrisionesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusquedaPrisionesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusquedaPrisionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
