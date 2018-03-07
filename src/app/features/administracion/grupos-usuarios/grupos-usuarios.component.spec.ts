import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GruposUsuarios } from './grupos-usuarios.component';

describe('HomeComponent', () => {
  let component: GruposUsuarios;
  let fixture: ComponentFixture<GruposUsuarios>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GruposUsuarios]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GruposUsuarios);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
