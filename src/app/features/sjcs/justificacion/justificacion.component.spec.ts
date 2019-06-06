import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JustificacionComponent } from './justificacion.component';

describe('JustificacionComponent', () => {
  let component: JustificacionComponent;
  let fixture: ComponentFixture<JustificacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [JustificacionComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JustificacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
