import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DireccionesFichaColegialComponent } from './direcciones-ficha-colegial.component';

describe('DireccionesFichaColegialComponent', () => {
  let component: DireccionesFichaColegialComponent;
  let fixture: ComponentFixture<DireccionesFichaColegialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DireccionesFichaColegialComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DireccionesFichaColegialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
