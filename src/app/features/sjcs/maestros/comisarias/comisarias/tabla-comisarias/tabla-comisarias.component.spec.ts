import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaComisariasComponent } from './tabla-comisarias.component';

describe('TablaComisariasComponent', () => {
  let component: TablaComisariasComponent;
  let fixture: ComponentFixture<TablaComisariasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TablaComisariasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TablaComisariasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
