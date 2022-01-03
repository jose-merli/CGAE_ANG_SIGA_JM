import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaAdeudosComponent } from './tabla-adeudos.component';

describe('TablaAdeudosComponent', () => {
  let component: TablaAdeudosComponent;
  let fixture: ComponentFixture<TablaAdeudosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TablaAdeudosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TablaAdeudosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
