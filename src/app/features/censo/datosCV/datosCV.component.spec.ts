import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatosCVComponent } from './datosCv.component';

describe('DatosCVComponent', () => {
  let component: DatosCVComponent;
  let fixture: ComponentFixture<DatosCVComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DatosCVComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatosCVComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
