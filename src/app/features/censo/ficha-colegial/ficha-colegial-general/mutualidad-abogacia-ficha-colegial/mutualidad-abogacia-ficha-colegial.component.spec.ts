import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MutualidadAbogaciaFichaColegialComponent } from './mutualidad-abogacia-ficha-colegial.component';

describe('MutualidadAbogaciaFichaColegialComponent', () => {
  let component: MutualidadAbogaciaFichaColegialComponent;
  let fixture: ComponentFixture<MutualidadAbogaciaFichaColegialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MutualidadAbogaciaFichaColegialComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MutualidadAbogaciaFichaColegialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
