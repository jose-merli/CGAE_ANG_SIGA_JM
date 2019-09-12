import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionJuzgadosComponent } from './gestion-juzgados.component';

describe('GestionJuzgadosComponent', () => {
  let component: GestionJuzgadosComponent;
  let fixture: ComponentFixture<GestionJuzgadosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GestionJuzgadosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionJuzgadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
