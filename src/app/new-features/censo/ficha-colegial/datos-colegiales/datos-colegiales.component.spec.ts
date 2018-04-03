import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatosColegialesComponent } from './datos-colegiales.component';

describe('DatosColegialesComponent', () => {
  let component: DatosColegialesComponent;
  let fixture: ComponentFixture<DatosColegialesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatosColegialesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatosColegialesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
