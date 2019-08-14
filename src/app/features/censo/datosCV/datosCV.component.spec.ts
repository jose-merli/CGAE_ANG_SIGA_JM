import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatosCVComponent2 } from './datosCV.component';

describe('DatosCVComponent', () => {
  let component: DatosCVComponent2;
  let fixture: ComponentFixture<DatosCVComponent2>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DatosCVComponent2]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatosCVComponent2);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
