import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltroActasComponent } from './filtro-actas.component';

describe('FiltroActasComponent', () => {
  let component: FiltroActasComponent;
  let fixture: ComponentFixture<FiltroActasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FiltroActasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FiltroActasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
