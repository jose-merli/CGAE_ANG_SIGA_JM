import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComunicacionInterprofesionalComponent } from './comunicacion-interprofesional.component';

describe('ComunicacionInterprofesionalComponent', () => {
  let component: ComunicacionInterprofesionalComponent;
  let fixture: ComponentFixture<ComunicacionInterprofesionalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ComunicacionInterprofesionalComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComunicacionInterprofesionalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
