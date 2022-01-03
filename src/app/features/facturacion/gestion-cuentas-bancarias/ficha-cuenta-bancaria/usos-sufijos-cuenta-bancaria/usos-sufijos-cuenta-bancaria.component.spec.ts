import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsosSufijosCuentaBancariaComponent } from './usos-sufijos-cuenta-bancaria.component';

describe('UsosSufijosCuentaBancariaComponent', () => {
  let component: UsosSufijosCuentaBancariaComponent;
  let fixture: ComponentFixture<UsosSufijosCuentaBancariaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsosSufijosCuentaBancariaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsosSufijosCuentaBancariaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
