import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaGuardiasComponent } from './tabla-guardias.component';

describe('TablaGuardiasComponent', () => {
  let component: TablaGuardiasComponent;
  let fixture: ComponentFixture<TablaGuardiasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TablaGuardiasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TablaGuardiasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
