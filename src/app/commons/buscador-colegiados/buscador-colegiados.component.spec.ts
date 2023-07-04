import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BuscadorColegiadosComponent } from './buscador-colegiados.component';

describe('BuscadorColegiadosComponent', () => {
  let component: BuscadorColegiadosComponent;
  let fixture: ComponentFixture<BuscadorColegiadosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BuscadorColegiadosComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuscadorColegiadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
