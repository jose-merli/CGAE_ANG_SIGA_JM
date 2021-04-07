import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaResultadoMixComponent } from './tabla-resultado-mix.component';

describe('TablaResultadoMixComponent', () => {
  let component: TablaResultadoMixComponent;
  let fixture: ComponentFixture<TablaResultadoMixComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TablaResultadoMixComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TablaResultadoMixComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
