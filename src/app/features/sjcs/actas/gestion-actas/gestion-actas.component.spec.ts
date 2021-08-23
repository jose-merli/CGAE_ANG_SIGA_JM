import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionActasComponent } from './gestion-actas.component';

describe('GestionActasComponent', () => {
  let component: GestionActasComponent;
  let fixture: ComponentFixture<GestionActasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GestionActasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionActasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
