import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FichaMovimientosVariosComponent } from './ficha-movimientos-varios.component';

describe('FichaMovimientosVariosComponent', () => {
  let component: FichaMovimientosVariosComponent;
  let fixture: ComponentFixture<FichaMovimientosVariosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FichaMovimientosVariosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FichaMovimientosVariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
