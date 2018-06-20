import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrevisionesFacturaComponent } from './previsiones-factura.component';

describe('PrevisionesFacturaComponent', () => {
  let component: PrevisionesFacturaComponent;
  let fixture: ComponentFixture<PrevisionesFacturaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PrevisionesFacturaComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrevisionesFacturaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
