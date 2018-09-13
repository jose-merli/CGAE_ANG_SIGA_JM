import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { FichaColegialComponent } from "./../ficha-colegial.component";

describe("FichaColegialComponent", () => {
  let component: FichaColegialComponent;
  let fixture: ComponentFixture<FichaColegialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FichaColegialComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FichaColegialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
