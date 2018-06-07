import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoriasServiciosComponent } from './categoriasServicios.component';

describe('CategoriasServiciosComponent', () => {
  let component: CategoriasServiciosComponent;
  let fixture: ComponentFixture<CategoriasServiciosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CategoriasServiciosComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoriasServiciosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
