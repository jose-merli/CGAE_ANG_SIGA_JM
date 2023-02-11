import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FacturasClassiqueComponent } from './facturas.component';

describe('FacturasClassiqueComponent', () => {
  let component: FacturasClassiqueComponent;
  let fixture: ComponentFixture<FacturasClassiqueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FacturasClassiqueComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FacturasClassiqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
