import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TarjetaComunicacionesComponent } from './tarjeta-comunicaciones.component';

describe('TarjetaComunicacionesComponent', () => {
  let component: TarjetaComunicacionesComponent;
  let fixture: ComponentFixture<TarjetaComunicacionesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TarjetaComunicacionesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TarjetaComunicacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
