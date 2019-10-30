import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FichaTurnosComponent } from './ficha-turnos.component';

describe('FichaConsultaComponent', () => {
  let component: FichaTurnosComponent;
  let fixture: ComponentFixture<FichaTurnosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FichaTurnosComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FichaTurnosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
