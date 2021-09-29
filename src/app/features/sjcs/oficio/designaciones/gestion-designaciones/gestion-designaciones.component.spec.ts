import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionDesignacionesComponent } from './gestion-designaciones.component';

describe('GestionDesignacionesComponent', () => {
  let component: GestionDesignacionesComponent;
  let fixture: ComponentFixture<GestionDesignacionesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GestionDesignacionesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionDesignacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
