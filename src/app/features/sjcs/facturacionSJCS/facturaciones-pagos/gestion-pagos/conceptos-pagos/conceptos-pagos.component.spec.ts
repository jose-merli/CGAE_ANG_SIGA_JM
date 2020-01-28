import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConceptosPagosComponent } from './conceptos-pagos.component';

describe('ConceptosPagosComponent', () => {
  let component: ConceptosPagosComponent;
  let fixture: ComponentFixture<ConceptosPagosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConceptosPagosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConceptosPagosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
