import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImpugnacionComponent } from './impugnacion.component';

describe('ImpugnacionComponent', () => {
  let component: ImpugnacionComponent;
  let fixture: ComponentFixture<ImpugnacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImpugnacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImpugnacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
