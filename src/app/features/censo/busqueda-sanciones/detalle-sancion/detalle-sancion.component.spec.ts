import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleSancionComponent } from './detalle-sancion.component';

describe('DetalleSancionComponent', () => {
  let component: DetalleSancionComponent;
  let fixture: ComponentFixture<DetalleSancionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetalleSancionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleSancionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
