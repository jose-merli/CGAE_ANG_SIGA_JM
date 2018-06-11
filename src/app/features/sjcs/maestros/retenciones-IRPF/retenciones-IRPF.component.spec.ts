import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RetencionesIRPFComponent } from './retenciones-IRPF.component';

describe('RetencionesIRPFComponent', () => {
  let component: RetencionesIRPFComponent;
  let fixture: ComponentFixture<RetencionesIRPFComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RetencionesIRPFComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RetencionesIRPFComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
