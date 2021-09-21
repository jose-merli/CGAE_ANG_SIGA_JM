import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DefensaJuridicaComponent } from './defensa-juridica.component';

describe('DefensaJuridicaComponent', () => {
  let component: DefensaJuridicaComponent;
  let fixture: ComponentFixture<DefensaJuridicaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DefensaJuridicaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DefensaJuridicaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
