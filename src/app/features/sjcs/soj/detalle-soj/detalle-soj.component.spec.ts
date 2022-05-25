import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleSOJComponent } from './detalle-soj.component';

describe('DetalleSOJComponent', () => {
  let component: DetalleSOJComponent;
  let fixture: ComponentFixture<DetalleSOJComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DetalleSOJComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleSOJComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
