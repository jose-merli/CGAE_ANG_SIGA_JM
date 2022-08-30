import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaIntercambiosAltaEjgComponent } from './lista-intercambios-alta-ejg.component';

describe('ListaIntercambiosAltaEjgComponent', () => {
  let component: ListaIntercambiosAltaEjgComponent;
  let fixture: ComponentFixture<ListaIntercambiosAltaEjgComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListaIntercambiosAltaEjgComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaIntercambiosAltaEjgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
