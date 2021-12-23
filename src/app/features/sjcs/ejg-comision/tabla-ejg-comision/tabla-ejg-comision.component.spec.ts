import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaEjgComisionComponent } from './tabla-ejg-comision.component';

describe('TablaEjgComisionComponent', () => {
  let component: TablaEjgComisionComponent;
  let fixture: ComponentFixture<TablaEjgComisionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TablaEjgComisionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TablaEjgComisionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
