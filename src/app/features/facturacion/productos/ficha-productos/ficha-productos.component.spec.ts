import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FichaProductosComponent } from './ficha-productos.component';

describe('FichaProductosComponent', () => {
  let component: FichaProductosComponent;
  let fixture: ComponentFixture<FichaProductosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FichaProductosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FichaProductosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
