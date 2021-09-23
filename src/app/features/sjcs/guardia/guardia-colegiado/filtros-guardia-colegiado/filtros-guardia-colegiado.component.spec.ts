import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltrosGuardiaColegiadoComponent } from './filtros-guardia-colegiado.component';

describe('FiltrosGuardiaColegiadoComponent', () => {
  let component: FiltrosGuardiaColegiadoComponent;
  let fixture: ComponentFixture<FiltrosGuardiaColegiadoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FiltrosGuardiaColegiadoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FiltrosGuardiaColegiadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
