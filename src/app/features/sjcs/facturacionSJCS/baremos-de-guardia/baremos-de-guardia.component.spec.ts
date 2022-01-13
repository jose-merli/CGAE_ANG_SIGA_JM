import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BaremosDeGuardiaComponent } from './baremos-de-guardia.component';

describe('BaremosDeGuardiaComponent', () => {
  let component: BaremosDeGuardiaComponent;
  let fixture: ComponentFixture<BaremosDeGuardiaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BaremosDeGuardiaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BaremosDeGuardiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
