import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FicherosTransferenciaClassiqueComponent } from './ficheros-transferencia.component';

describe('FicherosTransferenciaClassiqueComponent', () => {
  let component: FicherosTransferenciaClassiqueComponent;
  let fixture: ComponentFixture<FicherosTransferenciaClassiqueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FicherosTransferenciaClassiqueComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FicherosTransferenciaClassiqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
