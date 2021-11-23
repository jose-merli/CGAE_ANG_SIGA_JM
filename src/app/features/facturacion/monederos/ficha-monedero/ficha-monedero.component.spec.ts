import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FichaMonederoComponent } from './ficha-monedero.component';

describe('FichaMonederoComponent', () => {
  let component: FichaMonederoComponent;
  let fixture: ComponentFixture<FichaMonederoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FichaMonederoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FichaMonederoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
