import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaIntercambiosDocumentacionEjgComponent } from './lista-intercambios-documentacion-ejg.component';

describe('ListaIntercambiosDocumentacionEjgComponent', () => {
  let component: ListaIntercambiosDocumentacionEjgComponent;
  let fixture: ComponentFixture<ListaIntercambiosDocumentacionEjgComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListaIntercambiosDocumentacionEjgComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaIntercambiosDocumentacionEjgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
