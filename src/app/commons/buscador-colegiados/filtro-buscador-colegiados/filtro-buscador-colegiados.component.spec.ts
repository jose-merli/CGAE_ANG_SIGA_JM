import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltroBuscadorColegiadosComponent } from './filtro-buscador-colegiados.component';

describe('FiltroBuscadorColegiadosComponent', () => {
  let component: FiltroBuscadorColegiadosComponent;
  let fixture: ComponentFixture<FiltroBuscadorColegiadosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FiltroBuscadorColegiadosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FiltroBuscadorColegiadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
