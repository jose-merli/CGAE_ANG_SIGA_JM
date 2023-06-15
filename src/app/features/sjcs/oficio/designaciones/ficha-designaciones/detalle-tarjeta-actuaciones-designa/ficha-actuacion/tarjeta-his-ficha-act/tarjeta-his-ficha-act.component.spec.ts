import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TarjetaHisFichaActComponent } from './tarjeta-his-ficha-act.component';

describe('TarjetaHisFichaActComponent', () => {
  let component: TarjetaHisFichaActComponent;
  let fixture: ComponentFixture<TarjetaHisFichaActComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TarjetaHisFichaActComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TarjetaHisFichaActComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
