import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JustificacionExpresComponent } from './justificacion-expres.component';

describe('JustificacionExpresComponent', () => {
  let component: JustificacionExpresComponent;
  let fixture: ComponentFixture<JustificacionExpresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JustificacionExpresComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JustificacionExpresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
