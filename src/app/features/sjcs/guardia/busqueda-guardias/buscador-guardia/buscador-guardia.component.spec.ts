import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BuscadorGuardiaComponent } from './buscador-guardia.component';

describe('BuscadorGuardiaComponent', () => {
  let component: BuscadorGuardiaComponent;
  let fixture: ComponentFixture<BuscadorGuardiaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BuscadorGuardiaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuscadorGuardiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
