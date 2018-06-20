import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NuevaConsultaExpertaComponent } from './nueva-consulta-experta.component';

describe('NuevaConsultaExpertaComponent', () => {
  let component: NuevaConsultaExpertaComponent;
  let fixture: ComponentFixture<NuevaConsultaExpertaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NuevaConsultaExpertaComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NuevaConsultaExpertaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
