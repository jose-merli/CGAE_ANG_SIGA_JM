import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionDocumentacionejgComponent } from './gestion-documentacionejg.component';

describe('GestionDocumentacionejgComponent', () => {
  let component: GestionDocumentacionejgComponent;
  let fixture: ComponentFixture<GestionDocumentacionejgComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GestionDocumentacionejgComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionDocumentacionejgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
