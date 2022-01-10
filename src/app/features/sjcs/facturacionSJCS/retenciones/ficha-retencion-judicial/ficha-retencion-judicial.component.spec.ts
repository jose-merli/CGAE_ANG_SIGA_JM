import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FichaRetencionJudicialComponent } from './ficha-retencion-judicial.component';

describe('FichaRetencionJudicialComponent', () => {
  let component: FichaRetencionJudicialComponent;
  let fixture: ComponentFixture<FichaRetencionJudicialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FichaRetencionJudicialComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FichaRetencionJudicialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
