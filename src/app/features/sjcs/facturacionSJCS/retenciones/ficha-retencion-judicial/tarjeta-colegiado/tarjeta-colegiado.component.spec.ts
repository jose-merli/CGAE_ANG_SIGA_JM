import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TarjetaColegiadoComponent } from './tarjeta-colegiado.component';

describe('TarjetaColegiadoComponent', () => {
  let component: TarjetaColegiadoComponent;
  let fixture: ComponentFixture<TarjetaColegiadoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TarjetaColegiadoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TarjetaColegiadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
