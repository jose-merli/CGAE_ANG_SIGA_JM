import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RetencionesIrpfColegialComponent } from './retenciones-irpf-colegial.component';

describe('RetencionesIrpfColegialComponent', () => {
  let component: RetencionesIrpfColegialComponent;
  let fixture: ComponentFixture<RetencionesIrpfColegialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RetencionesIrpfColegialComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RetencionesIrpfColegialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
