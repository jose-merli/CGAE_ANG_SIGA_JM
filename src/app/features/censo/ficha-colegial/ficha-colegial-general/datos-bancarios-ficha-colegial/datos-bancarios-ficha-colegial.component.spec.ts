import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatosBancariosFichaColegialComponent } from './datos-bancarios-ficha-colegial.component';

describe('DatosBancariosFichaColegialComponent', () => {
  let component: DatosBancariosFichaColegialComponent;
  let fixture: ComponentFixture<DatosBancariosFichaColegialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatosBancariosFichaColegialComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatosBancariosFichaColegialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
