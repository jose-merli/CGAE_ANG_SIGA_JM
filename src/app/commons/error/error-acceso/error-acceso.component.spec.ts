import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorAccesoComponent } from './error-acceso.component';

describe('ErrorAccesoComponent', () => {
  let component: ErrorAccesoComponent;
  let fixture: ComponentFixture<ErrorAccesoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ErrorAccesoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorAccesoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
