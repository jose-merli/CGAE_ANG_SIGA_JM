import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusquedaColegiadosComponent } from './busqueda-colegiados.component';

describe('BusquedaColegiadosComponent', () => {
  let component: BusquedaColegiadosComponent;
  let fixture: ComponentFixture<BusquedaColegiadosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BusquedaColegiadosComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusquedaColegiadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
