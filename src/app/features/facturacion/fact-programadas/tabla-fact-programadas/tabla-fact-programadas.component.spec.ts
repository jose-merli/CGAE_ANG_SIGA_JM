import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaFactProgramadasComponent } from './tabla-fact-programadas.component';

describe('TablaFactProgramadasComponent', () => {
  let component: TablaFactProgramadasComponent;
  let fixture: ComponentFixture<TablaFactProgramadasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TablaFactProgramadasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TablaFactProgramadasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
