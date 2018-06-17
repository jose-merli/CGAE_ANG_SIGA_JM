import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComunicaPreparacionComponent } from './comunica-preparacion.component';

describe('ComunicaPreparacionComponent', () => {
  let component: ComunicaPreparacionComponent;
  let fixture: ComponentFixture<ComunicaPreparacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ComunicaPreparacionComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComunicaPreparacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
