import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { TipoCurricularComponent } from "./tipo-curricular.component";

describe("GestionSubtiposCVComponent", () => {
  let component: TipoCurricularComponent;
  let fixture: ComponentFixture<TipoCurricularComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TipoCurricularComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TipoCurricularComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
