import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaGuardiaComponent } from './tabla-guardia.component';

describe('TablaGuardiaComponent', () => {
  let component: TablaGuardiaComponent;
  let fixture: ComponentFixture<TablaGuardiaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TablaGuardiaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TablaGuardiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
