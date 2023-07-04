import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComisionesCargosComponent } from './comisiones-cargos.component';

describe('ComisionesCargosComponent', () => {
  let component: ComisionesCargosComponent;
  let fixture: ComponentFixture<ComisionesCargosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ComisionesCargosComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComisionesCargosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
