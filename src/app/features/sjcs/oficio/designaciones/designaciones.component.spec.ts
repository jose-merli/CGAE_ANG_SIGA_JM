import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DesignacionesComponent } from './designaciones.component';

describe('DesignacionesComponent', () => {
  let component: DesignacionesComponent;
  let fixture: ComponentFixture<DesignacionesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DesignacionesComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DesignacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
