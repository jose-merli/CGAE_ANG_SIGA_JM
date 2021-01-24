import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegtelFichaColegialComponent } from './regtel-ficha-colegial.component';

describe('RegtelFichaColegialComponent', () => {
  let component: RegtelFichaColegialComponent;
  let fixture: ComponentFixture<RegtelFichaColegialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegtelFichaColegialComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegtelFichaColegialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
