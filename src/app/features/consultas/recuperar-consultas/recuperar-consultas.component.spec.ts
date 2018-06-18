import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecuperarConsultasComponent } from './recuperar-consultas.component';

describe('RecuperarConsultasComponent', () => {
  let component: RecuperarConsultasComponent;
  let fixture: ComponentFixture<RecuperarConsultasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RecuperarConsultasComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecuperarConsultasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
