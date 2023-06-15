import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TurnosClassiqueComponent } from './turnos.component';

describe('TurnosClassiqueComponent', () => {
  let component: TurnosClassiqueComponent;
  let fixture: ComponentFixture<TurnosClassiqueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TurnosClassiqueComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TurnosClassiqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
