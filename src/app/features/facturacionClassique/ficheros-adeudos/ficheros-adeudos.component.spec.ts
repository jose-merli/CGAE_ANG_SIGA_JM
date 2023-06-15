import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FicherosAdeudosClassiqueComponent } from './ficheros-adeudos.component';

describe('FicherosAdeudosClassiqueComponent', () => {
  let component: FicherosAdeudosClassiqueComponent;
  let fixture: ComponentFixture<FicherosAdeudosClassiqueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FicherosAdeudosClassiqueComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FicherosAdeudosClassiqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
