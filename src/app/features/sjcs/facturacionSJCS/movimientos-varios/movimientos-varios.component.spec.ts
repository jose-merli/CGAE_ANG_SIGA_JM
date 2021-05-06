import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MovimientosVariosComponent } from './movimientos-varios.component';

describe('MovimientosVariosComponent', () => {
  let component: MovimientosVariosComponent;
  let fixture: ComponentFixture<MovimientosVariosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MovimientosVariosComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MovimientosVariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
