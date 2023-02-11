import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TiposAsistenciaClassiqueComponent } from './tiposAsistencia.component';

describe('TiposAsistenciaClassiqueComponent', () => {
  let component: TiposAsistenciaClassiqueComponent;
  let fixture: ComponentFixture<TiposAsistenciaClassiqueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TiposAsistenciaClassiqueComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TiposAsistenciaClassiqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
