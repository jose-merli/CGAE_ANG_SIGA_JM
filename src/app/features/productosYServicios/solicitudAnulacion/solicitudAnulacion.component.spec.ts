import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitudAnulacionComponent } from './solicitudAnulacion.component';

describe('SolicitudAnulacionComponent', () => {
  let component: SolicitudAnulacionComponent;
  let fixture: ComponentFixture<SolicitudAnulacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SolicitudAnulacionComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SolicitudAnulacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
