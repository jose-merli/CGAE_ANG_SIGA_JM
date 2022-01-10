import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaBusquedaBaremosComponent } from './tabla-busqueda-baremos.component';

describe('TablaBusquedaBaremosComponent', () => {
  let component: TablaBusquedaBaremosComponent;
  let fixture: ComponentFixture<TablaBusquedaBaremosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TablaBusquedaBaremosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TablaBusquedaBaremosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
