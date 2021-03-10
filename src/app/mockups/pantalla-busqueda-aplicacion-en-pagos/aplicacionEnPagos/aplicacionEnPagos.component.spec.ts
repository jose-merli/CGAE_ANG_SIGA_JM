import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AplicacionEnPagosComponent } from './aplicacionEnPagos.component';

describe('AplicacionEnPagosComponent', () => {
  let component: AplicacionEnPagosComponent;
  let fixture: ComponentFixture<AplicacionEnPagosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AplicacionEnPagosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AplicacionEnPagosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
