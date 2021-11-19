import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaFicherosTransferenciasComponent } from './tabla-ficheros-transferencias.component';

describe('TablaFicherosTransferenciasComponent', () => {
  let component: TablaFicherosTransferenciasComponent;
  let fixture: ComponentFixture<TablaFicherosTransferenciasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TablaFicherosTransferenciasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TablaFicherosTransferenciasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
