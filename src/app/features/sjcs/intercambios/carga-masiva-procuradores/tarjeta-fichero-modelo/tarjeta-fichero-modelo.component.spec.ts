import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TarjetaFicheroModeloComponent } from './tarjeta-fichero-modelo.component';

describe('TarjetaFicheroModeloComponent', () => {
  let component: TarjetaFicheroModeloComponent;
  let fixture: ComponentFixture<TarjetaFicheroModeloComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TarjetaFicheroModeloComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TarjetaFicheroModeloComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
