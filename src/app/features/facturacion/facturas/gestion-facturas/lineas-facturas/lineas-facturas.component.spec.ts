import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LineasFacturasComponent } from './lineas-facturas.component';

describe('LineasFacturasComponent', () => {
  let component: LineasFacturasComponent;
  let fixture: ComponentFixture<LineasFacturasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LineasFacturasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LineasFacturasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
