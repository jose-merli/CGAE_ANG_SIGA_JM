import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FacturacionesComponent } from './facturaciones.component';

describe('FacturacionesComponent', () => {
  let component: FacturacionesComponent;
  let fixture: ComponentFixture<FacturacionesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FacturacionesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FacturacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
