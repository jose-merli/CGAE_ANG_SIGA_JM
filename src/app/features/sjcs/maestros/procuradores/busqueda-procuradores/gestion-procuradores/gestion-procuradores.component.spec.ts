import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionProcuradoresComponent } from './gestion-procuradores.component';

describe('GestionProcuradoresComponent', () => {
  let component: GestionProcuradoresComponent;
  let fixture: ComponentFixture<GestionProcuradoresComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GestionProcuradoresComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionProcuradoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
