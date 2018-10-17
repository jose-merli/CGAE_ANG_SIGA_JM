import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MutualidadAbogaciaPlanUniversal } from './mutualidad-abogacia-plan-universal.component';

describe('SolicitudesIncorporacionComponent', () => {
  let component: MutualidadAbogaciaPlanUniversal;
  let fixture: ComponentFixture<MutualidadAbogaciaPlanUniversal>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MutualidadAbogaciaPlanUniversal]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MutualidadAbogaciaPlanUniversal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
