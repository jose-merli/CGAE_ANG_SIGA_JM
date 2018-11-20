import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetallePlantillaEnvioComponent } from './detalle-plantilla-envio.component';

describe('DetallePlantillaEnvioComponent', () => {
  let component: DetallePlantillaEnvioComponent;
  let fixture: ComponentFixture<DetallePlantillaEnvioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetallePlantillaEnvioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetallePlantillaEnvioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
