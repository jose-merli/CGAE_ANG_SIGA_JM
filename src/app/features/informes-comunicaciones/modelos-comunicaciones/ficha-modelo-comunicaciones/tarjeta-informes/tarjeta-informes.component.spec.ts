import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TarjetaInformesComponent } from './tarjeta-informes.component';

describe('TarjetaInformesComponent', () => {
  let component: TarjetaInformesComponent;
  let fixture: ComponentFixture<TarjetaInformesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TarjetaInformesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TarjetaInformesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
