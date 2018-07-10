import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatosBancariosComponent } from './datos-bancarios.component';

describe('DatosBancariosComponent', () => {
  let component: DatosBancariosComponent;
  let fixture: ComponentFixture<DatosBancariosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatosBancariosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatosBancariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
