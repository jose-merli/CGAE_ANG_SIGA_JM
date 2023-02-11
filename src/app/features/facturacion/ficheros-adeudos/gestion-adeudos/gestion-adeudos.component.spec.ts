import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionAdeudosComponent } from './gestion-adeudos.component';

describe('GestionAdeudosComponent', () => {
  let component: GestionAdeudosComponent;
  let fixture: ComponentFixture<GestionAdeudosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GestionAdeudosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionAdeudosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
