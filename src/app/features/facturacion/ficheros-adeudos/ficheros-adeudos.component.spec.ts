import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FicherosAdeudosComponent } from './ficheros-adeudos.component';

describe('FicherosAdeudosComponent', () => {
  let component: FicherosAdeudosComponent;
  let fixture: ComponentFixture<FicherosAdeudosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FicherosAdeudosComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FicherosAdeudosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
