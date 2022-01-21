import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionExpedientesExeaComponent } from './gestion-expedientes-exea.component';

describe('GestionExpedientesExeaComponent', () => {
  let component: GestionExpedientesExeaComponent;
  let fixture: ComponentFixture<GestionExpedientesExeaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GestionExpedientesExeaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionExpedientesExeaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
