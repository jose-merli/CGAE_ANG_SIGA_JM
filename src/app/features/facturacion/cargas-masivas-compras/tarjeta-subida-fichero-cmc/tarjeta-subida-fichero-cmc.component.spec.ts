import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TarjetaSubidaFicheroCmcComponent } from './tarjeta-subida-fichero-cmc.component';

describe('TarjetaSubidaFicheroCmcComponent', () => {
  let component: TarjetaSubidaFicheroCmcComponent;
  let fixture: ComponentFixture<TarjetaSubidaFicheroCmcComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TarjetaSubidaFicheroCmcComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TarjetaSubidaFicheroCmcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
