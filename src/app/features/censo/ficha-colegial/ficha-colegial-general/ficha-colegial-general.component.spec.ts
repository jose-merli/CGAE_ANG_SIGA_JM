import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FichaColegialGeneralComponent } from './ficha-colegial-general.component';

describe('FichaColegialGeneralComponent', () => {
  let component: FichaColegialGeneralComponent;
  let fixture: ComponentFixture<FichaColegialGeneralComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FichaColegialGeneralComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FichaColegialGeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
