import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicioInteresComponent } from './servicio-interes.component';

describe('ServicioInteresComponent', () => {
  let component: ServicioInteresComponent;
  let fixture: ComponentFixture<ServicioInteresComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServicioInteresComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServicioInteresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
