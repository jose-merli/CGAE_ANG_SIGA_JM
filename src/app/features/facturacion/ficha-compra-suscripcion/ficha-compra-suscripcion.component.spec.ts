import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FichaCompraSuscripcionComponent } from './ficha-compra-suscripcion.component';

describe('FichaCompraSuscripcionComponent', () => {
  let component: FichaCompraSuscripcionComponent;
  let fixture: ComponentFixture<FichaCompraSuscripcionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FichaCompraSuscripcionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FichaCompraSuscripcionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
