import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FacturaPlantillasComponent } from './factura-plantillas.component';

describe('FacturaPlantillasComponent', () => {
  let component: FacturaPlantillasComponent;
  let fixture: ComponentFixture<FacturaPlantillasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FacturaPlantillasComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FacturaPlantillasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
