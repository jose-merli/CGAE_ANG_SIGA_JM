import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FichaBarConfiFacComponent } from './ficha-bar-confi-fac.component';

describe('FichaBarConfiFacComponent', () => {
  let component: FichaBarConfiFacComponent;
  let fixture: ComponentFixture<FichaBarConfiFacComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FichaBarConfiFacComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FichaBarConfiFacComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
