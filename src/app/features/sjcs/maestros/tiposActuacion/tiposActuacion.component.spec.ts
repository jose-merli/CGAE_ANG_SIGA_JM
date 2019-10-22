import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TiposActuacionComponent } from './tiposActuacion.component';

describe('TiposActuacionComponent', () => {
  let component: TiposActuacionComponent;
  let fixture: ComponentFixture<TiposActuacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TiposActuacionComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TiposActuacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
