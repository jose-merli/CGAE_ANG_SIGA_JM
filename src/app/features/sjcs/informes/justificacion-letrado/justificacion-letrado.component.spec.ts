import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JustificacionLetradoComponent } from './justificacion-letrado.component';

describe('JustificacionLetradoComponent', () => {
  let component: JustificacionLetradoComponent;
  let fixture: ComponentFixture<JustificacionLetradoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [JustificacionLetradoComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JustificacionLetradoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
