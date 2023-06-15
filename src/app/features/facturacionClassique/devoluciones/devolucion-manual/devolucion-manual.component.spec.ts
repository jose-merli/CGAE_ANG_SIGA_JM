import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DevolucionManualClassiqueComponent } from './devolucion-manual.component';

describe('DevolucionManualClassiqueComponent', () => {
  let component: DevolucionManualClassiqueComponent;
  let fixture: ComponentFixture<DevolucionManualClassiqueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DevolucionManualClassiqueComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DevolucionManualClassiqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
