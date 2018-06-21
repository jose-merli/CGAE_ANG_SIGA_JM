import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DevolucionManualComponent } from './devolucion-manual.component';

describe('DevolucionManualComponent', () => {
  let component: DevolucionManualComponent;
  let fixture: ComponentFixture<DevolucionManualComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DevolucionManualComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DevolucionManualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
