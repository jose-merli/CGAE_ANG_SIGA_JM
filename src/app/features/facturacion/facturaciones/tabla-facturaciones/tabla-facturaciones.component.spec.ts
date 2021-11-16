import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaFacturacionesComponent } from './tabla-facturaciones.component';

describe('TablaFacturacionesComponent', () => {
  let component: TablaFacturacionesComponent;
  let fixture: ComponentFixture<TablaFacturacionesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TablaFacturacionesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TablaFacturacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
