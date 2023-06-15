import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltroComisariasComponent } from './filtro-comisarias.component';

describe('FiltroComisariasComponent', () => {
  let component: FiltroComisariasComponent;
  let fixture: ComponentFixture<FiltroComisariasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FiltroComisariasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FiltroComisariasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
