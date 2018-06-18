import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EliminarFacturaComponent } from './eliminar-factura.component';

describe('EliminarFacturaComponent', () => {
  let component: EliminarFacturaComponent;
  let fixture: ComponentFixture<EliminarFacturaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EliminarFacturaComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EliminarFacturaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
