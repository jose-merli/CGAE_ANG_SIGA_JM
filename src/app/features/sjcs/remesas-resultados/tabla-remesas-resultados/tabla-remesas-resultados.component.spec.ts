import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TablaRemesasResultadosComponent } from './tabla-remesas-resultados.component';

describe('TablaRemesasResultadosComponent', () => {
  let component: TablaRemesasResultadosComponent;
  let fixture: ComponentFixture<TablaRemesasResultadosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TablaRemesasResultadosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TablaRemesasResultadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
