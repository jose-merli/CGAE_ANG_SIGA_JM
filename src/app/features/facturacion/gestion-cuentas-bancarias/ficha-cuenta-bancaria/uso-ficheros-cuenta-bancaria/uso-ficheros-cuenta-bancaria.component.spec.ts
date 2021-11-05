import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsoFicherosCuentaBancariaComponent } from './uso-ficheros-cuenta-bancaria.component';

describe('UsoFicherosCuentaBancariaComponent', () => {
  let component: UsoFicherosCuentaBancariaComponent;
  let fixture: ComponentFixture<UsoFicherosCuentaBancariaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsoFicherosCuentaBancariaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsoFicherosCuentaBancariaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
