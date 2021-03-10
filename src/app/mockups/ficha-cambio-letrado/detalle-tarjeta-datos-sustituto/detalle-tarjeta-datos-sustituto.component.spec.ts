import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleTarjetaDatosSustitutoComponent } from './detalle-tarjeta-datos-sustituto.component';

describe('DetalleTarjetaDatosSustitutoComponent', () => {
  let component: DetalleTarjetaDatosSustitutoComponent;
  let fixture: ComponentFixture<DetalleTarjetaDatosSustitutoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetalleTarjetaDatosSustitutoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleTarjetaDatosSustitutoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
