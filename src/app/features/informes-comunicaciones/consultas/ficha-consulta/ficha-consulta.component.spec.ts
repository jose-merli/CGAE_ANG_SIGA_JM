import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FichaConsultaComponent } from './ficha-consulta.component';

describe('FichaConsultaComponent', () => {
  let component: FichaConsultaComponent;
  let fixture: ComponentFixture<FichaConsultaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FichaConsultaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FichaConsultaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
