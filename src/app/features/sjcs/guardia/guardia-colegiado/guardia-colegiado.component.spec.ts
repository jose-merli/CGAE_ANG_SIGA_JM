import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GuardiaColegiadoComponent } from './guardia-colegiado.component';

describe('GuardiaColegiadoComponent', () => {
  let component: GuardiaColegiadoComponent;
  let fixture: ComponentFixture<GuardiaColegiadoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GuardiaColegiadoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GuardiaColegiadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
