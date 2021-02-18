import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaEjgComponent } from './tabla-ejg.component';

describe('TablaEjgComponent', () => {
  let component: TablaEjgComponent;
  let fixture: ComponentFixture<TablaEjgComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TablaEjgComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TablaEjgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
