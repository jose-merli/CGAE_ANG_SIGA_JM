import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FichaCalendarioComponent } from './ficha-calendario.component';

describe('FichaCalendarioComponent', () => {
  let component: FichaCalendarioComponent;
  let fixture: ComponentFixture<FichaCalendarioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FichaCalendarioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FichaCalendarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
