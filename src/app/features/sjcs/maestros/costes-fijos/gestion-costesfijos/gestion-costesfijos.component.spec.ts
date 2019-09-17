import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionCostesfijosComponent } from './gestion-costesfijos.component';

describe('GestionCostesfijosComponent', () => {
  let component: GestionCostesfijosComponent;
  let fixture: ComponentFixture<GestionCostesfijosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GestionCostesfijosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionCostesfijosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
