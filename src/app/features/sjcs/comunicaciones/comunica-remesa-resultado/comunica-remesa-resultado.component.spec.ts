import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComunicaRemesaResultadoComponent } from './comunica-remesa-resultado.component';

describe('ComunicaRemesaResultadoComponent', () => {
  let component: ComunicaRemesaResultadoComponent;
  let fixture: ComponentFixture<ComunicaRemesaResultadoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ComunicaRemesaResultadoComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComunicaRemesaResultadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
