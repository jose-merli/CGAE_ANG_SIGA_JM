import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltroJusticiablesComponent } from './filtro-justiciables.component';

describe('FiltroJusticiablesComponent', () => {
  let component: FiltroJusticiablesComponent;
  let fixture: ComponentFixture<FiltroJusticiablesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FiltroJusticiablesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FiltroJusticiablesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
