import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaestroPJClassiqueComponent } from './maestro-pj.component';

describe('MaestroPJClassiqueComponent', () => {
  let component: MaestroPJClassiqueComponent;
  let fixture: ComponentFixture<MaestroPJClassiqueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MaestroPJClassiqueComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaestroPJClassiqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
