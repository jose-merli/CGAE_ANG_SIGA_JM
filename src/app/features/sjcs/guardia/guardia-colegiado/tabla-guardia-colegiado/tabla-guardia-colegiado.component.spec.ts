import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaGuardiaColegiadoComponent } from './tabla-guardia-colegiado.component';

describe('TablaGuardiaColegiadoComponent', () => {
  let component: TablaGuardiaColegiadoComponent;
  let fixture: ComponentFixture<TablaGuardiaColegiadoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TablaGuardiaColegiadoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TablaGuardiaColegiadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
