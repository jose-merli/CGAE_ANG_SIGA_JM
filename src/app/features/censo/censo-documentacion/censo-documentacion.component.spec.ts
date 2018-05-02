import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CensoDocumentacionComponent } from './censo-documentacion.component';

describe('CensoDocumentacionComponent', () => {
  let component: CensoDocumentacionComponent;
  let fixture: ComponentFixture<CensoDocumentacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CensoDocumentacionComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CensoDocumentacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
