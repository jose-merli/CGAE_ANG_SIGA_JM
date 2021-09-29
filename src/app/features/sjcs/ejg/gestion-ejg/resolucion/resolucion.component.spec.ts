import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResolucionComponent } from './resolucion.component';

describe('ResolucionComponent', () => {
  let component: ResolucionComponent;
  let fixture: ComponentFixture<ResolucionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResolucionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResolucionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
