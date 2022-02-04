import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FichaExpedienteExeaComponent } from './ficha-expediente-exea.component';

describe('FichaExpedienteExeaComponent', () => {
  let component: FichaExpedienteExeaComponent;
  let fixture: ComponentFixture<FichaExpedienteExeaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FichaExpedienteExeaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FichaExpedienteExeaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
