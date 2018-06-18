import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TiposAsistenciaComponent } from './tiposAsistencia.component';

describe('TiposAsistenciaComponent', () => {
  let component: TiposAsistenciaComponent;
  let fixture: ComponentFixture<TiposAsistenciaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TiposAsistenciaComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TiposAsistenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
