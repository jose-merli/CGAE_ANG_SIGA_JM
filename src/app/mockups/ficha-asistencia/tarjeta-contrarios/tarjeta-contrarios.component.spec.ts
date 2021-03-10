import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TarjetaContrariosComponent } from './tarjeta-contrarios.component';

describe('TarjetaContrariosComponent', () => {
  let component: TarjetaContrariosComponent;
  let fixture: ComponentFixture<TarjetaContrariosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TarjetaContrariosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TarjetaContrariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
