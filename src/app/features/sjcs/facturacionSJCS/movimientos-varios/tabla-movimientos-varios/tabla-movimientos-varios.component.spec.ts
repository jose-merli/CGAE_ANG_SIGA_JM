import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaMovimientosVariosComponent } from './tabla-movimientos-varios.component';

describe('TablaMovimientosVariosComponent', () => {
  let component: TablaMovimientosVariosComponent;
  let fixture: ComponentFixture<TablaMovimientosVariosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TablaMovimientosVariosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TablaMovimientosVariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
