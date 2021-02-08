import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuscadorColegialComponent } from './buscador-colegial.component';

describe('BuscadorColegialComponent', () => {
  let component: BuscadorColegialComponent;
  let fixture: ComponentFixture<BuscadorColegialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BuscadorColegialComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BuscadorColegialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
