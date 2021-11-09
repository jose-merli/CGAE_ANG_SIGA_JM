import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TablaRemesasResolucionesComponent } from './tabla-remesas-resoluciones.component';

describe('TablaRemesasResolucionesComponent', () => {
  let component: TablaRemesasResolucionesComponent;
  let fixture: ComponentFixture<TablaRemesasResolucionesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TablaRemesasResolucionesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TablaRemesasResolucionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
