import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitarCompraComponent } from './solicitar-compra.component';

describe('SolicitarCompraComponent', () => {
  let component: SolicitarCompraComponent;
  let fixture: ComponentFixture<SolicitarCompraComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SolicitarCompraComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SolicitarCompraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
