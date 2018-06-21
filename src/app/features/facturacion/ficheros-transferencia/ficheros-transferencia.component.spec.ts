import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FicherosTransferenciaComponent } from './ficheros-transferencia.component';

describe('FicherosTransferenciaComponent', () => {
  let component: FicherosTransferenciaComponent;
  let fixture: ComponentFixture<FicherosTransferenciaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FicherosTransferenciaComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FicherosTransferenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
