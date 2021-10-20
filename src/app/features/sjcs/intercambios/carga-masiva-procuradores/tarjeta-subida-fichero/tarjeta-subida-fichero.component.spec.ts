import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TarjetaSubidaFicheroComponent } from './tarjeta-subida-fichero.component';

describe('TarjetaSubidaFicheroComponent', () => {
  let component: TarjetaSubidaFicheroComponent;
  let fixture: ComponentFixture<TarjetaSubidaFicheroComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TarjetaSubidaFicheroComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TarjetaSubidaFicheroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
