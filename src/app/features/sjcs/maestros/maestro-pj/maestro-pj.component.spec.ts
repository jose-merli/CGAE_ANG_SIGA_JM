import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaestroPJComponent } from './maestro-pj.component';

describe('MaestroPJComponent', () => {
  let component: MaestroPJComponent;
  let fixture: ComponentFixture<MaestroPJComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MaestroPJComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaestroPJComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
