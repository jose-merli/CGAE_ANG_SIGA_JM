import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaJustificacionExpresComponent } from './tabla-justificacion-expres.component';

describe('BuscadorJustificacionExpresComponent', () => {
  let component: TablaJustificacionExpresComponent;
  let fixture: ComponentFixture<TablaJustificacionExpresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TablaJustificacionExpresComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TablaJustificacionExpresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
