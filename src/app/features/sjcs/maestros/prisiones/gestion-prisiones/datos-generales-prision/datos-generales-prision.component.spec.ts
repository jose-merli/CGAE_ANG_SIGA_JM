import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatosGeneralesPrisionComponent } from './datos-generales-prision.component';

describe('DatosGeneralesPrisionComponent', () => {
  let component: DatosGeneralesPrisionComponent;
  let fixture: ComponentFixture<DatosGeneralesPrisionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatosGeneralesPrisionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatosGeneralesPrisionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
