import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgramarFacturaComponent } from './programar-factura.component';

describe('ProgramarFacturaComponent', () => {
  let component: ProgramarFacturaComponent;
  let fixture: ComponentFixture<ProgramarFacturaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProgramarFacturaComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgramarFacturaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
