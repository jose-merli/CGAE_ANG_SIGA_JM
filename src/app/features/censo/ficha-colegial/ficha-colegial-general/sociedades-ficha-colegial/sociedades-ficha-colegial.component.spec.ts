import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SociedadesFichaColegialComponent } from './sociedades-ficha-colegial.component';

describe('SociedadesFichaColegialComponent', () => {
  let component: SociedadesFichaColegialComponent;
  let fixture: ComponentFixture<SociedadesFichaColegialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SociedadesFichaColegialComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SociedadesFichaColegialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
