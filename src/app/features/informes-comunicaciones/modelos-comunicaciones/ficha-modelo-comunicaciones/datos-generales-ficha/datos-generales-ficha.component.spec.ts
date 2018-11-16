import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatosGeneralesFichaComponent } from './datos-generales-ficha.component';

describe('DatosGeneralesFichaComponent', () => {
  let component: DatosGeneralesFichaComponent;
  let fixture: ComponentFixture<DatosGeneralesFichaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DatosGeneralesFichaComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatosGeneralesFichaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
