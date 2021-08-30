import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltrosEjgComponent } from './filtros-ejg.component';

describe('FiltrosEjgComponent', () => {
  let component: FiltrosEjgComponent;
  let fixture: ComponentFixture<FiltrosEjgComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FiltrosEjgComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FiltrosEjgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
