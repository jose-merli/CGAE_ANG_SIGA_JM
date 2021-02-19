import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltrosGuardiaComponent } from './filtros-guardia.component';

describe('FiltrosGuardiaComponent', () => {
  let component: FiltrosGuardiaComponent;
  let fixture: ComponentFixture<FiltrosGuardiaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FiltrosGuardiaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FiltrosGuardiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
