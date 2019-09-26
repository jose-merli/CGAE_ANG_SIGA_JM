import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaFundamentosresolucionComponent } from './tabla-fundamentosresolucion.component';

describe('TablaFundamentosresolucionComponent', () => {
  let component: TablaFundamentosresolucionComponent;
  let fixture: ComponentFixture<TablaFundamentosresolucionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TablaFundamentosresolucionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TablaFundamentosresolucionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
