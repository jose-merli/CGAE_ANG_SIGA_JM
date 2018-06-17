import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComunicaCargaComponent } from './comunica-carga.component';

describe('ComunicaCargaComponent', () => {
  let component: ComunicaCargaComponent;
  let fixture: ComponentFixture<ComunicaCargaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ComunicaCargaComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComunicaCargaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
