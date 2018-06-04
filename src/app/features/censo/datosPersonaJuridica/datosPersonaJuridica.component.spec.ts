import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { DatosPersonaJuridicaComponent } from "./datosPersonaJuridica.component";

describe("DetalleSociedadComponent", () => {
  let component: DatosPersonaJuridicaComponent;
  let fixture: ComponentFixture<DatosPersonaJuridicaComponent>;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        declarations: [DatosPersonaJuridicaComponent]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(DatosPersonaJuridicaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
