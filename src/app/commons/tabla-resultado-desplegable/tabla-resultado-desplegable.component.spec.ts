import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaResultadoDesplegableComponent } from './tabla-resultado-desplegable.component';

describe('TablaResultadoDesplegableComponent', () => {
  let component: TablaResultadoDesplegableComponent;
  let fixture: ComponentFixture<TablaResultadoDesplegableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TablaResultadoDesplegableComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TablaResultadoDesplegableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
