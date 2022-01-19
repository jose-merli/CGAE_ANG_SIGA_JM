import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltroBusquedaBaremosComponent } from './filtro-busqueda-baremos.component';

describe('FiltroBusquedaBaremosComponent', () => {
  let component: FiltroBusquedaBaremosComponent;
  let fixture: ComponentFixture<FiltroBusquedaBaremosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FiltroBusquedaBaremosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FiltroBusquedaBaremosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
