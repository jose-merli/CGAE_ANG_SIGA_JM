import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcuradorPreDesignacionComponent } from './procurador-pre-designacion.component';

describe('ProcuradorPreDesignacionComponent', () => {
  let component: ProcuradorPreDesignacionComponent;
  let fixture: ComponentFixture<ProcuradorPreDesignacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProcuradorPreDesignacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcuradorPreDesignacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
