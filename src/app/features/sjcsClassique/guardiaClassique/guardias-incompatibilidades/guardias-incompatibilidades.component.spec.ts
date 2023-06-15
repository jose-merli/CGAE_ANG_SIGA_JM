import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GuardiasIncompatibilidadesClassiqueComponent } from './guardias-incompatibilidades.component';

describe('GuardiasIncompatibilidadesClassiqueComponent', () => {
  let component: GuardiasIncompatibilidadesClassiqueComponent;
  let fixture: ComponentFixture<GuardiasIncompatibilidadesClassiqueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GuardiasIncompatibilidadesClassiqueComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GuardiasIncompatibilidadesClassiqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
