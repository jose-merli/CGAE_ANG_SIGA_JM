import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EjgComisionComponent } from './ejg-comision.component';

describe('EjgComisionComponent', () => {
  let component: EjgComisionComponent;
  let fixture: ComponentFixture<EjgComisionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EjgComisionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EjgComisionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
