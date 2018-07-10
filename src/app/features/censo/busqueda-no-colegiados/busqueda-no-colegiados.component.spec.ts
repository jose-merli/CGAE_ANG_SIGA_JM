import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusquedaNoColegiadosComponent } from './busqueda-no-colegiados.component';

describe('BusquedaNoColegiadosComponent', () => {
  let component: BusquedaNoColegiadosComponent;
  let fixture: ComponentFixture<BusquedaNoColegiadosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BusquedaNoColegiadosComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusquedaNoColegiadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
