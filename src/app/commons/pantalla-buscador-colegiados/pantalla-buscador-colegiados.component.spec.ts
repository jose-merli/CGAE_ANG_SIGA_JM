import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PantallaBuscadorColegiadosComponent } from './pantalla-buscador-colegiados.component';

describe('PantallaBuscadorColegiadosComponent', () => {
  let component: PantallaBuscadorColegiadosComponent;
  let fixture: ComponentFixture<PantallaBuscadorColegiadosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PantallaBuscadorColegiadosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PantallaBuscadorColegiadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
