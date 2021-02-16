import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FichaActuacionOficioComponent } from './ficha-actuacion-oficio.component';

describe('FichaActuacionOficioComponent', () => {
  let component: FichaActuacionOficioComponent;
  let fixture: ComponentFixture<FichaActuacionOficioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FichaActuacionOficioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FichaActuacionOficioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
