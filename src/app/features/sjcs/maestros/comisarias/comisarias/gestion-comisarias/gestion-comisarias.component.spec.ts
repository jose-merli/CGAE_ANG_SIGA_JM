import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionComisariasComponent } from './gestion-comisarias.component';

describe('GestionComisariasComponent', () => {
  let component: GestionComisariasComponent;
  let fixture: ComponentFixture<GestionComisariasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GestionComisariasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionComisariasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
