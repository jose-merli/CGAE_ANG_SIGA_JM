import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FichaGrupoZonaComponent } from './ficha-grupo-zona.component';

describe('FichaGrupoZonaComponent', () => {
  let component: FichaGrupoZonaComponent;
  let fixture: ComponentFixture<FichaGrupoZonaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FichaGrupoZonaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FichaGrupoZonaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
