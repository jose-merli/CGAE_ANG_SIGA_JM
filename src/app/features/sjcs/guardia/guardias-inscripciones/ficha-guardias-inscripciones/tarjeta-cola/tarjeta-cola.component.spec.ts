import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TarjetaColaComponent } from './tarjeta-cola.component';

describe('TarjetaColaComponent', () => {
  let component: TarjetaColaComponent;
  let fixture: ComponentFixture<TarjetaColaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TarjetaColaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TarjetaColaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
