import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FichaActuacionDesignaOficioComponent } from './ficha-actuacion-designa-oficio.component';

describe('FichaActuacionDesignaOficioComponent', () => {
  let component: FichaActuacionDesignaOficioComponent;
  let fixture: ComponentFixture<FichaActuacionDesignaOficioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FichaActuacionDesignaOficioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FichaActuacionDesignaOficioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
