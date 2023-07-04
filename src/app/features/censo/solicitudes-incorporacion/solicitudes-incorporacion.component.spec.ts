import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitudesIncorporacionComponent } from './solicitudes-incorporacion.component';

describe('SolicitudesIncorporacionComponent', () => {
  let component: SolicitudesIncorporacionComponent;
  let fixture: ComponentFixture<SolicitudesIncorporacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SolicitudesIncorporacionComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SolicitudesIncorporacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
