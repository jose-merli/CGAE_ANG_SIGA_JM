import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { Usuarios } from "./editarCatalogosMaestros.component";

describe("HomeComponent", () => {
  let component: Usuarios;
  let fixture: ComponentFixture<editarCatalogosMaestros>;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        declarations: [Usuarios]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(Usuarios);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
