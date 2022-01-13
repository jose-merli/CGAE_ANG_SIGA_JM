import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TarjetaCriteriosAplicacionComponent } from './tarjeta-criterios-aplicacion.component';

describe('TarjetaCriteriosAplicacionComponent', () => {
  let component: TarjetaCriteriosAplicacionComponent;
  let fixture: ComponentFixture<TarjetaCriteriosAplicacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TarjetaCriteriosAplicacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TarjetaCriteriosAplicacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
