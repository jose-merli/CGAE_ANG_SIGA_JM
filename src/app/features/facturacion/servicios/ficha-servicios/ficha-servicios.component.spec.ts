import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FichaServiciosComponent } from './ficha-servicios.component';

describe('FichaServiciosComponent', () => {
  let component: FichaServiciosComponent;
  let fixture: ComponentFixture<FichaServiciosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FichaServiciosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FichaServiciosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
