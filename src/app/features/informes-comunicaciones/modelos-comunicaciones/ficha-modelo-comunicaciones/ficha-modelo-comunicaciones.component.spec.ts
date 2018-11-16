import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FichaModeloComunicacionesComponent } from './ficha-modelo-comunicaciones.component';

describe('FichaModeloComunicacionesComponent', () => {
  let component: FichaModeloComunicacionesComponent;
  let fixture: ComponentFixture<FichaModeloComunicacionesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FichaModeloComunicacionesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FichaModeloComunicacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
