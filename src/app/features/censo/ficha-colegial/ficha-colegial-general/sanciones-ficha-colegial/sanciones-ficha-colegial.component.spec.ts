import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SancionesFichaColegialComponent } from './sanciones-ficha-colegial.component';

describe('SancionesFichaColegialComponent', () => {
  let component: SancionesFichaColegialComponent;
  let fixture: ComponentFixture<SancionesFichaColegialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SancionesFichaColegialComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SancionesFichaColegialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
