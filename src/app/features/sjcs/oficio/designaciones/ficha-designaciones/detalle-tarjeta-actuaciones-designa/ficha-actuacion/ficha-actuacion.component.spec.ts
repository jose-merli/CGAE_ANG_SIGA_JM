import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FichaActuacionComponent } from './ficha-actuacion.component';

describe('FichaActuacionComponent', () => {
  let component: FichaActuacionComponent;
  let fixture: ComponentFixture<FichaActuacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FichaActuacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FichaActuacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
