import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusquedaJuzgadosComponent } from './busqueda-juzgados.component';

describe('BusquedaJuzgadosComponent', () => {
  let component: BusquedaJuzgadosComponent;
  let fixture: ComponentFixture<BusquedaJuzgadosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusquedaJuzgadosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusquedaJuzgadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
