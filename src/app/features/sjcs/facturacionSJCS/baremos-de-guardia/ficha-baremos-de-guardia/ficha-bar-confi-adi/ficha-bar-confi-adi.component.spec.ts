import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FichaBarConfiAdiComponent } from './ficha-bar-confi-adi.component';

describe('FichaBarConfiAdiComponent', () => {
  let component: FichaBarConfiAdiComponent;
  let fixture: ComponentFixture<FichaBarConfiAdiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FichaBarConfiAdiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FichaBarConfiAdiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
