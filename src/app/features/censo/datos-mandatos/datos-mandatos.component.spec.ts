import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatosMandatosComponent } from './datos-mandatos.component';

describe('DatosMandatosComponent', () => {
  let component: DatosMandatosComponent;
  let fixture: ComponentFixture<DatosMandatosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatosMandatosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatosMandatosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
