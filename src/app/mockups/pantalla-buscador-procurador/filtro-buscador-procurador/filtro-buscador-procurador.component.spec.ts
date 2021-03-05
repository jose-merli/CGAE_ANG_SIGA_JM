import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltroBuscadorProcuradorComponent } from './filtro-buscador-procurador.component';

describe('FiltroBuscadorProcuradorComponent', () => {
  let component: FiltroBuscadorProcuradorComponent;
  let fixture: ComponentFixture<FiltroBuscadorProcuradorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FiltroBuscadorProcuradorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FiltroBuscadorProcuradorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
