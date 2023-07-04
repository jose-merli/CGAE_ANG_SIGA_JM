import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaResultadoOrderComponent } from './tabla-resultado-order.component';

describe('TablaResultadoOrderComponent', () => {
  let component: TablaResultadoOrderComponent;
  let fixture: ComponentFixture<TablaResultadoOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TablaResultadoOrderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TablaResultadoOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
