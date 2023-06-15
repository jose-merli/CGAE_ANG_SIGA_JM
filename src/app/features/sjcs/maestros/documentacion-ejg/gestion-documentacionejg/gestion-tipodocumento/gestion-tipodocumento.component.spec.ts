import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionTipodocumentoComponent } from './gestion-tipodocumento.component';

describe('GestionTipodocumentoComponent', () => {
  let component: GestionTipodocumentoComponent;
  let fixture: ComponentFixture<GestionTipodocumentoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GestionTipodocumentoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionTipodocumentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
