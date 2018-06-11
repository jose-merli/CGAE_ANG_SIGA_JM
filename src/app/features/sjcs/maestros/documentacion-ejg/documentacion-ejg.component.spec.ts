import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentacionEJGComponent } from './documentacion-ejg.component';

describe('DocumentacionEJGComponent', () => {
  let component: DocumentacionEJGComponent;
  let fixture: ComponentFixture<DocumentacionEJGComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DocumentacionEJGComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentacionEJGComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
