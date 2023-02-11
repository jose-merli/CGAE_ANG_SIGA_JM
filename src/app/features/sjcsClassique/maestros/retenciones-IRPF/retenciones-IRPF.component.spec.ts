import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RetencionesIRPFClassiqueComponent } from './retenciones-IRPF.component';

describe('RetencionesIRPFClassiqueComponent', () => {
  let component: RetencionesIRPFClassiqueComponent;
  let fixture: ComponentFixture<RetencionesIRPFClassiqueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RetencionesIRPFClassiqueComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RetencionesIRPFClassiqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
