import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionarExpedientesComponent } from './gestionar-expedientes.component';

describe('GestionarExpedientesComponent', () => {
  let component: GestionarExpedientesComponent;
  let fixture: ComponentFixture<GestionarExpedientesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GestionarExpedientesComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionarExpedientesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
