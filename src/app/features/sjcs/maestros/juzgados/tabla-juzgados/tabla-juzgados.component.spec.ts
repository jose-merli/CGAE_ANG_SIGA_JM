import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaJuzgadosComponent } from './tabla-juzgados.component';

describe('TablaJuzgadosComponent', () => {
  let component: TablaJuzgadosComponent;
  let fixture: ComponentFixture<TablaJuzgadosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TablaJuzgadosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TablaJuzgadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
