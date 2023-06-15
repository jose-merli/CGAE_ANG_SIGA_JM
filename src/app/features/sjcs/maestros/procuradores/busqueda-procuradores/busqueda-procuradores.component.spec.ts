import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusquedaProcuradoresComponent } from './busqueda-procuradores.component';

describe('BusquedaProcuradoresComponent', () => {
  let component: BusquedaProcuradoresComponent;
  let fixture: ComponentFixture<BusquedaProcuradoresComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusquedaProcuradoresComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusquedaProcuradoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
