import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitanteDetalleSojComponent } from './solicitante-detalle-soj.component';

describe('SolicitanteDetalleSojComponent', () => {
  let component: SolicitanteDetalleSojComponent;
  let fixture: ComponentFixture<SolicitanteDetalleSojComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SolicitanteDetalleSojComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SolicitanteDetalleSojComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
