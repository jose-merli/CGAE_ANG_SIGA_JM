import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaJusticiablesComponent } from './tabla-justiciables.component';

describe('TablaJusticiablesComponent', () => {
  let component: TablaJusticiablesComponent;
  let fixture: ComponentFixture<TablaJusticiablesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TablaJusticiablesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TablaJusticiablesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
