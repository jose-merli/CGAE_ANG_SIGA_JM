import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComunicacionesCensoComponent } from './comunicaciones.component';

describe('MediadoresComponent', () => {
  let component: ComunicacionesCensoComponent;
  let fixture: ComponentFixture<ComunicacionesCensoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ComunicacionesCensoComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComunicacionesCensoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
