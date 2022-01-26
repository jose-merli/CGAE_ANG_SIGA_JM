import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NuevoExpedienteExeaComponent } from './nuevo-expediente-exea.component';

describe('NuevoExpedienteExeaComponent', () => {
  let component: NuevoExpedienteExeaComponent;
  let fixture: ComponentFixture<NuevoExpedienteExeaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NuevoExpedienteExeaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NuevoExpedienteExeaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
