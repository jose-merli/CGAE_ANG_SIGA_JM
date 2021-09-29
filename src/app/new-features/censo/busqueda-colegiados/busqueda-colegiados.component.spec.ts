import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BusquedaColegiadosComponentNew } from './busqueda-colegiados.component';
describe('BusquedaColegiadosComponentNew', () => {
  let component: BusquedaColegiadosComponentNew;
  let fixture: ComponentFixture<BusquedaColegiadosComponentNew>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BusquedaColegiadosComponentNew]
    })
      .compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(BusquedaColegiadosComponentNew);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
