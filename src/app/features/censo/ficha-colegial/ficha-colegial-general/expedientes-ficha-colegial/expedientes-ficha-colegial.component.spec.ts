import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpedientesFichaColegialComponent } from './expedientes-ficha-colegial.component';

describe('ExpedientesFichaColegialComponent', () => {
  let component: ExpedientesFichaColegialComponent;
  let fixture: ComponentFixture<ExpedientesFichaColegialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpedientesFichaColegialComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpedientesFichaColegialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
