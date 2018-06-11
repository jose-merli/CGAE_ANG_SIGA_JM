import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AreasYMateriasComponent } from './areas-materias.component';

describe('AreasYMateriasComponent', () => {
  let component: AreasYMateriasComponent;
  let fixture: ComponentFixture<AreasYMateriasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AreasYMateriasComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AreasYMateriasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
