import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TarjetaBusquedaCmcComponent } from './tarjeta-busqueda-cmc.component';

describe('TarjetaBusquedaCmcComponent', () => {
  let component: TarjetaBusquedaCmcComponent;
  let fixture: ComponentFixture<TarjetaBusquedaCmcComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TarjetaBusquedaCmcComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TarjetaBusquedaCmcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
