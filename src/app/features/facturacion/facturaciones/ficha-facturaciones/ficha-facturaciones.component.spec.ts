import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FichaFacturacionesComponent } from './ficha-facturaciones.component';

describe('FichaFacturacionesComponent', () => {
  let component: FichaFacturacionesComponent;
  let fixture: ComponentFixture<FichaFacturacionesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FichaFacturacionesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FichaFacturacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
