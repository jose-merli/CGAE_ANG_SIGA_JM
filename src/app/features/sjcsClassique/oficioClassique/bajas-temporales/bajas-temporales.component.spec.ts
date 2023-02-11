import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BajasTemporalesClassiqueComponent } from './bajas-temporales.component';

describe('BajasTemporalesClassiqueComponent', () => {
  let component: BajasTemporalesClassiqueComponent;
  let fixture: ComponentFixture<BajasTemporalesClassiqueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BajasTemporalesClassiqueComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BajasTemporalesClassiqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
