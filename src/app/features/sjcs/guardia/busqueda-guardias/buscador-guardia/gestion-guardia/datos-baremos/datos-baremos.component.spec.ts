import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatosBaremosComponent } from './datos-baremos.component';

describe('DatosBaremosComponent', () => {
  let component: DatosBaremosComponent;
  let fixture: ComponentFixture<DatosBaremosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatosBaremosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatosBaremosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
