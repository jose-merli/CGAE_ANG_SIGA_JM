import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FichaPreDesignacionComponent } from './ficha-pre-designacion.component';

describe('FichaPreDesignacionComponent', () => {
  let component: FichaPreDesignacionComponent;
  let fixture: ComponentFixture<FichaPreDesignacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FichaPreDesignacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FichaPreDesignacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
