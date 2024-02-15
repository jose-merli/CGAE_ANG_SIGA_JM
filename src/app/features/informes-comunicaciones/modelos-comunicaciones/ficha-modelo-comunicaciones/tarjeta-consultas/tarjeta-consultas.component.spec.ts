import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TarjetaConsultasComponent } from './tarjeta-consultas.component';


describe('TarjetaConsultasComponent', () => {
  let component: TarjetaConsultasComponent;
  let fixture: ComponentFixture<TarjetaConsultasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TarjetaConsultasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TarjetaConsultasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
