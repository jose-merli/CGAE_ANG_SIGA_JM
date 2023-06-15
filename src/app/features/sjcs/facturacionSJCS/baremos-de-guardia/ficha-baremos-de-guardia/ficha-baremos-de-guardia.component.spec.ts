import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FichaBaremosDeGuardiaComponent } from './ficha-baremos-de-guardia.component';

describe('FichaBaremosDeGuardiaComponent', () => {
  let component: FichaBaremosDeGuardiaComponent;
  let fixture: ComponentFixture<FichaBaremosDeGuardiaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FichaBaremosDeGuardiaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FichaBaremosDeGuardiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
