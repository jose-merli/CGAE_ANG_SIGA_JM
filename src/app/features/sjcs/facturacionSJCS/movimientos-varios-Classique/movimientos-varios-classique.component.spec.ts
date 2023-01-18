import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MovimientosVariosComponentClassique } from './movimientos-varios-classique.component';

describe('MovimientosVariosComponentClassique', () => {
  let component: MovimientosVariosComponentClassique;
  let fixture: ComponentFixture<MovimientosVariosComponentClassique>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MovimientosVariosComponentClassique]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MovimientosVariosComponentClassique);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
