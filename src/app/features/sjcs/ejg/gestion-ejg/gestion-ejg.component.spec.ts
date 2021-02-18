import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionEjgComponent } from './gestion-ejg.component';

describe('GestionEjgComponent', () => {
  let component: GestionEjgComponent;
  let fixture: ComponentFixture<GestionEjgComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GestionEjgComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionEjgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
