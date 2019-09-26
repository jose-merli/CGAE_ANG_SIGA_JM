import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaPrisionesComponent } from './tabla-prisiones.component';

describe('TablaPrisionesComponent', () => {
  let component: TablaPrisionesComponent;
  let fixture: ComponentFixture<TablaPrisionesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TablaPrisionesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TablaPrisionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
