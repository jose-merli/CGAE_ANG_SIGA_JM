import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltrosServiciosComponent } from './filtros-servicios.component';

describe('FiltrosServiciosComponent', () => {
  let component: FiltrosServiciosComponent;
  let fixture: ComponentFixture<FiltrosServiciosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FiltrosServiciosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FiltrosServiciosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
