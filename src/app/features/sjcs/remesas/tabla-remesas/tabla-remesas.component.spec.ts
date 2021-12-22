import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaRemesasComponent } from './tabla-remesas.component';

describe('TablaRemesasComponent', () => {
  let component: TablaRemesasComponent;
  let fixture: ComponentFixture<TablaRemesasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TablaRemesasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TablaRemesasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
