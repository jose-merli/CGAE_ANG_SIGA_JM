import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CargaMasivaProcuradoresComponent } from './carga-masiva-procuradores.component';

describe('CargaMasivaProcuradoresComponent', () => {
  let component: CargaMasivaProcuradoresComponent;
  let fixture: ComponentFixture<CargaMasivaProcuradoresComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CargaMasivaProcuradoresComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CargaMasivaProcuradoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
