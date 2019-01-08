import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusquedaCensoGeneralComponent } from './busqueda-censo-general.component';

describe('BusquedaCensoGeneralComponent', () => {
  let component: BusquedaCensoGeneralComponent;
  let fixture: ComponentFixture<BusquedaCensoGeneralComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusquedaCensoGeneralComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusquedaCensoGeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
