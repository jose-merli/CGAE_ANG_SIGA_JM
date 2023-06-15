import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaDocumentacionejgComponent } from './tabla-documentacionejg.component';

describe('TablaDocumentacionejgComponent', () => {
  let component: TablaDocumentacionejgComponent;
  let fixture: ComponentFixture<TablaDocumentacionejgComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TablaDocumentacionejgComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TablaDocumentacionejgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
