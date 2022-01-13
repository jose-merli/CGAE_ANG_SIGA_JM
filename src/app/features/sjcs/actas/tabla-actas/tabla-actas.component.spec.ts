import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaActasComponent } from './tabla-actas.component';

describe('TablaActasComponent', () => {
  let component: TablaActasComponent;
  let fixture: ComponentFixture<TablaActasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TablaActasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TablaActasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
