import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TarjetaAsistidoComponent } from './tarjeta-asistido.component';

describe('TarjetaAsistidoComponent', () => {
  let component: TarjetaAsistidoComponent;
  let fixture: ComponentFixture<TarjetaAsistidoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TarjetaAsistidoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TarjetaAsistidoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
