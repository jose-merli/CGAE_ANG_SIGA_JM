import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TarjetaFicheroModeloCmcComponent } from './tarjeta-fichero-modelo-cmc.component';

describe('TarjetaFicheroModeloCmcComponent', () => {
  let component: TarjetaFicheroModeloCmcComponent;
  let fixture: ComponentFixture<TarjetaFicheroModeloCmcComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TarjetaFicheroModeloCmcComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TarjetaFicheroModeloCmcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
