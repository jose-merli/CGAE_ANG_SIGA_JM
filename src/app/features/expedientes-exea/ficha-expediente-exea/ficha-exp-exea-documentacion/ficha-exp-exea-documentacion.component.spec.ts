import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FichaExpExeaDocumentacionComponent } from './ficha-exp-exea-documentacion.component';

describe('FichaExpExeaDocumentacionComponent', () => {
  let component: FichaExpExeaDocumentacionComponent;
  let fixture: ComponentFixture<FichaExpExeaDocumentacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FichaExpExeaDocumentacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FichaExpExeaDocumentacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
