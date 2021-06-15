import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaBuscadorColegiadosComponent } from './tabla-buscador-colegiados.component';

describe('TablaBuscadorColegiadosComponent', () => {
  let component: TablaBuscadorColegiadosComponent;
  let fixture: ComponentFixture<TablaBuscadorColegiadosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TablaBuscadorColegiadosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TablaBuscadorColegiadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
