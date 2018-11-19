import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlantillaDocumentoComponent } from './plantilla-documento.component';

describe('PlantillaDocumentoComponent', () => {
  let component: PlantillaDocumentoComponent;
  let fixture: ComponentFixture<PlantillaDocumentoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlantillaDocumentoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlantillaDocumentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
