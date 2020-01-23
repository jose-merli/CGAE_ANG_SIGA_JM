import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatosPagosComponent } from './datos-pagos.component';

describe('DatosPagosComponent', () => {
  let component: DatosPagosComponent;
  let fixture: ComponentFixture<DatosPagosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatosPagosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatosPagosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
