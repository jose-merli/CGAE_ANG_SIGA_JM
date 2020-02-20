import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlterMutuaFichaColegialComponent } from './alter-mutua-ficha-colegial.component';

describe('AlterMutuaFichaColegialComponent', () => {
  let component: AlterMutuaFichaColegialComponent;
  let fixture: ComponentFixture<AlterMutuaFichaColegialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlterMutuaFichaColegialComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlterMutuaFichaColegialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
