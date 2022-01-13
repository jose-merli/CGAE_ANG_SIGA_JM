import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GuardiasIncompatibilidadesComponent } from './guardias-incompatibilidades.component';

describe('GuardiasIncompatibilidadesComponent', () => {
  let component: GuardiasIncompatibilidadesComponent;
  let fixture: ComponentFixture<GuardiasIncompatibilidadesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GuardiasIncompatibilidadesComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GuardiasIncompatibilidadesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
