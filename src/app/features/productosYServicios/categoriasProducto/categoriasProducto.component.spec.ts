import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoriasProductoComponent } from './categoriasProducto.component';

describe('CategoriasProductoComponent', () => {
  let component: CategoriasProductoComponent;
  let fixture: ComponentFixture<CategoriasProductoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CategoriasProductoComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoriasProductoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
