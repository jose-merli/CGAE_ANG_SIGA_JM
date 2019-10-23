import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusquedaJusticiablesComponent } from './busqueda-justiciables.component';

describe('BusquedaJusticiablesComponent', () => {
  let component: BusquedaJusticiablesComponent;
  let fixture: ComponentFixture<BusquedaJusticiablesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusquedaJusticiablesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusquedaJusticiablesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
