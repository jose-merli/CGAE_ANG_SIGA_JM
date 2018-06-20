import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DefinirTipoPlantillaComponent } from './definir-tipo-plantilla.component';

describe('DefinirTipoPlantillaComponent', () => {
  let component: DefinirTipoPlantillaComponent;
  let fixture: ComponentFixture<DefinirTipoPlantillaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DefinirTipoPlantillaComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DefinirTipoPlantillaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
