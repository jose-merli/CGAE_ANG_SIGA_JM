import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentacionDetalleSojComponent } from './documentacion-detalle-soj.component';

describe('DocumentacionDetalleSojComponent', () => {
  let component: DocumentacionDetalleSojComponent;
  let fixture: ComponentFixture<DocumentacionDetalleSojComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentacionDetalleSojComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentacionDetalleSojComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
