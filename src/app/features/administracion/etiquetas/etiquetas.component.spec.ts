import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Etiquetas } from './etiquetas.component';

describe('HomeComponent', () => {
  let component: Etiquetas;
  let fixture: ComponentFixture<Etiquetas>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [Etiquetas]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Etiquetas);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
