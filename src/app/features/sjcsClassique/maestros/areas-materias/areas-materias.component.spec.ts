import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AreasYMateriasClassiqueComponent } from './areas-materias.component';

describe('AreasYMateriasClassiqueComponent', () => {
  let component: AreasYMateriasClassiqueComponent;
  let fixture: ComponentFixture<AreasYMateriasClassiqueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AreasYMateriasClassiqueComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AreasYMateriasClassiqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
