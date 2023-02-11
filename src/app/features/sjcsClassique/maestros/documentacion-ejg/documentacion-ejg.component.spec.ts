import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentacionEJGClassiqueComponent } from './documentacion-ejg.component';

describe('DocumentacionEJGClassiqueComponent', () => {
  let component: DocumentacionEJGClassiqueComponent;
  let fixture: ComponentFixture<DocumentacionEJGClassiqueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DocumentacionEJGClassiqueComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentacionEJGClassiqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
