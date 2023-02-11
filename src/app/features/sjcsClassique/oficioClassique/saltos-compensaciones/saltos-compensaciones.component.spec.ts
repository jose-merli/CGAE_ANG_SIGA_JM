import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SaltosYCompensacionesClassiqueComponent } from './saltos-compensaciones.component';

describe('SaltosYCompensacionesClassiqueComponent', () => {
  let component: SaltosYCompensacionesClassiqueComponent;
  let fixture: ComponentFixture<SaltosYCompensacionesClassiqueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SaltosYCompensacionesClassiqueComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaltosYCompensacionesClassiqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
