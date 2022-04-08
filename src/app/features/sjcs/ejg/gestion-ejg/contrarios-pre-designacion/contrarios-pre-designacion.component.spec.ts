import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContrariosPreDesignacionComponent } from './contrarios-pre-designacion.component';

describe('ContrariosPreDesignacionComponent', () => {
  let component: ContrariosPreDesignacionComponent;
  let fixture: ComponentFixture<ContrariosPreDesignacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContrariosPreDesignacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContrariosPreDesignacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
