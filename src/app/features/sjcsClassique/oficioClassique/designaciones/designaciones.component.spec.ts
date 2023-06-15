import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DesignacionesClassiqueComponent } from './designaciones.component';

describe('DesignacionesClassiqueComponent', () => {
  let component: DesignacionesClassiqueComponent;
  let fixture: ComponentFixture<DesignacionesClassiqueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DesignacionesClassiqueComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DesignacionesClassiqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
