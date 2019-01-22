import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusquedaCursosComponent } from './busqueda-cursos.component';

describe('BusquedaCursosComponent', () => {
  let component: BusquedaCursosComponent;
  let fixture: ComponentFixture<BusquedaCursosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusquedaCursosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusquedaCursosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
