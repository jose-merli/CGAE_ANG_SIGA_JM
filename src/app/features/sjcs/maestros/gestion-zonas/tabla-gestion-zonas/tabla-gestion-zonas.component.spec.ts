import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaGestionZonasComponent } from './tabla-gestion-zonas.component';

describe('TablaGestionZonasComponent', () => {
  let component: TablaGestionZonasComponent;
  let fixture: ComponentFixture<TablaGestionZonasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TablaGestionZonasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TablaGestionZonasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
