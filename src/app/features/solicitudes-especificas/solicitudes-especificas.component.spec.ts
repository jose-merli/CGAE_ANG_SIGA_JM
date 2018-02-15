import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitudesEspecificasComponent } from './solicitudes-especificas.component';

describe('SolicitudesEspecificasComponent', () => {
  let component: SolicitudesEspecificasComponent;
  let fixture: ComponentFixture<SolicitudesEspecificasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SolicitudesEspecificasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SolicitudesEspecificasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
