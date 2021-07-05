import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltroRemesasComponent } from './filtro-remesas.component';

describe('FiltroRemesasComponent', () => {
  let component: FiltroRemesasComponent;
  let fixture: ComponentFixture<FiltroRemesasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FiltroRemesasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FiltroRemesasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
