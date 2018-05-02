import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusquedaLetradosComponent } from './busqueda-letrados.component';

describe('BusquedaLetradosComponent', () => {
  let component: BusquedaLetradosComponent;
  let fixture: ComponentFixture<BusquedaLetradosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BusquedaLetradosComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusquedaLetradosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
