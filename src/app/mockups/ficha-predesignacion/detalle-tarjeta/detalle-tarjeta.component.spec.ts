import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleTarjetaComponent } from './detalle-tarjeta.component';

describe('DetalleTarjetaComponent', () => {
  let component: DetalleTarjetaComponent;
  let fixture: ComponentFixture<DetalleTarjetaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetalleTarjetaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleTarjetaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
