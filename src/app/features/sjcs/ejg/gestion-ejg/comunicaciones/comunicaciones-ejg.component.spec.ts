import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComunicacionesEJGComponent } from './comunicaciones-ejg.component';

describe('ComunicacionesEJGComponent', () => {
  let component: ComunicacionesEJGComponent;
  let fixture: ComponentFixture<ComunicacionesEJGComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComunicacionesEJGComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComunicacionesEJGComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
